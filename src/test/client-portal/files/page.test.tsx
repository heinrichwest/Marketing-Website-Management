import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ClientFileSharingPage from '../../../../app/client-portal/files/page'
import { AuthProvider } from '../../../../context/auth-context'
import * as mockData from '../../../../lib/mock-data'

// Mock the mock-data functions
vi.mock('../../../lib/mock-data', () => ({
  getProjectsByUserId: vi.fn(),
  getUsers: vi.fn(),
  addMessage: vi.fn(),
  addFileShare: vi.fn(),
}))

// Mock the components
vi.mock('../../../components/navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}))

vi.mock('../../../components/footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

// Mock React Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

const mockClientUser = {
  id: 'user-5',
  email: 'client@system.com',
  password: 'client123',
  fullName: 'Michael Client',
  role: 'client' as const,
  phone: '+27821234571',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
}

const mockAdminUser = {
  id: 'user-1',
  email: 'admin@system.com',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'admin' as const,
  phone: '+27821234567',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
}

const mockProjects = [
  {
    id: 'proj-1',
    name: 'SpecCon',
    description: 'Main SpecCon corporate website',
    projectType: 'website' as const,
    clientId: 'user-5',
    currentStage: 'maintenance' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'proj-2',
    name: 'Andebe',
    description: 'Andebe Skills Development platform',
    projectType: 'website' as const,
    clientId: 'user-5',
    currentStage: 'development' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const renderWithAuth = (user: any | null) => {
  return render(
    <AuthProvider>
      <ClientFileSharingPage />
    </AuthProvider>
  )
}

describe('ClientFileSharingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    vi.mocked(mockData.getProjectsByUserId).mockReturnValue(mockProjects)
    vi.mocked(mockData.getUsers).mockReturnValue([mockAdminUser, mockClientUser])
    vi.mocked(mockData.addMessage).mockImplementation(() => {})
    vi.mocked(mockData.addFileShare).mockImplementation(() => {})
  })

  describe('Authentication & Access Control', () => {
    it('should render loading state when user is not authenticated', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      })

      renderWithAuth(null)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should redirect unauthorized users (non-client) away from page', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => JSON.stringify(mockAdminUser)),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      })

      renderWithAuth(mockAdminUser)
      
      // Should show loading spinner for unauthorized users
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should render page for authenticated client users', () => {
      renderWithAuth(mockClientUser)
      
      expect(screen.getByText('Share Files with Your Team')).toBeInTheDocument()
      expect(screen.getByText('Upload documents, images, or any files your project team needs to access')).toBeInTheDocument()
    })

    it('should load user-specific projects on mount', () => {
      renderWithAuth(mockClientUser)
      
      expect(mockData.getProjectsByUserId).toHaveBeenCalledWith('user-5', 'client')
    })

    it('should auto-select first project when projects are loaded', () => {
      renderWithAuth(mockClientUser)
      
      const projectSelect = screen.getByDisplayValue('SpecCon')
      expect(projectSelect).toBeInTheDocument()
    })
  })

  describe('File Upload Features', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should show file upload area with correct styling', () => {
      const uploadArea = screen.getByText(/Drop files here or click to browse/)
      expect(uploadArea).toBeInTheDocument()
      
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')
      expect(fileInput).toHaveAttribute('multiple')
      expect(fileInput).toHaveAttribute('accept', '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.zip,.rar')
    })

    it('should handle file selection correctly', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      expect(screen.getByText('test.pdf')).toBeInTheDocument()
      expect(screen.getByText('Files to Upload')).toBeInTheDocument()
    })

    it('should handle multiple file selection', async () => {
      const files = [
        new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      ]
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } })
      })
      
      expect(screen.getByText('test1.pdf')).toBeInTheDocument()
      expect(screen.getByText('test2.jpg')).toBeInTheDocument()
      expect(screen.getByText('Files to Upload')).toBeInTheDocument()
    })

    it('should display file size correctly', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      expect(screen.getByText(/\d+\.?\d* Bytes/)).toBeInTheDocument()
    })

    it('should remove files correctly', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const removeButton = screen.getByRole('button', { name: /remove file/i })
      await act(async () => {
        fireEvent.click(removeButton)
      })
      
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
      expect(screen.queryByText('Files to Upload')).not.toBeInTheDocument()
    })
  })

  describe('Project Integration', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should display project selection dropdown', () => {
      const projectSelect = screen.getByDisplayValue('SpecCon')
      expect(projectSelect).toBeInTheDocument()
    })

    it('should show all user projects in dropdown', () => {
      expect(screen.getByDisplayValue('SpecCon')).toBeInTheDocument()
      expect(screen.getByText('Andebe')).toBeInTheDocument()
    })

    it('should handle project selection change', async () => {
      const projectSelect = screen.getByDisplayValue('SpecCon')
      
      await act(async () => {
        fireEvent.change(projectSelect, { target: { value: 'proj-2' } })
      })
      
      expect(projectSelect).toHaveValue('proj-2')
    })
  })

  describe('Email & Message Features', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should show email input when files are selected', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Add a message to include with your files...')).toBeInTheDocument()
    })

    it('should handle email input changes', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      })
      
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('should handle message input changes', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const messageInput = screen.getByPlaceholderText('Add a message to include with your files...')
      await act(async () => {
        fireEvent.change(messageInput, { target: { value: 'Please review these files.' } })
      })
      
      expect(messageInput).toHaveValue('Please review these files.')
    })
  })

  describe('Upload Functionality', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should enable upload button when files are selected', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      expect(uploadButton).not.toBeDisabled()
    })

    it('should create file share records on upload', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      await waitFor(() => {
        expect(mockData.addFileShare).toHaveBeenCalledWith(
          expect.objectContaining({
            fileName: 'test.pdf',
            projectId: 'proj-1',
            uploadedBy: 'user-5',
            isPublic: true,
          })
        )
      })
    })

    it('should show loading state during upload', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      expect(screen.getByText('Uploading...')).toBeInTheDocument()
    })

    it('should reset form after successful upload', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
        expect(screen.queryByText('Files to Upload')).not.toBeInTheDocument()
      })
    })

    it('should show success message after upload', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Files uploaded successfully!')
      })
    })
  })

  describe('Send File Functionality', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should validate email before sending', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      expect(window.alert).toHaveBeenCalledWith('Please enter a recipient email address.')
    })

    it('should validate email format', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      expect(window.alert).toHaveBeenCalledWith('Please enter a valid email address.')
    })

    it('should create file share records and notify admins on send', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'recipient@example.com' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      await waitFor(() => {
        expect(mockData.addFileShare).toHaveBeenCalledWith(
          expect.objectContaining({
            fileName: 'test.pdf',
            projectId: 'proj-1',
            uploadedBy: 'user-5',
          })
        )
        
        expect(mockData.addMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            subject: 'Files Sent via Email - SpecCon',
            content: expect.stringContaining('recipient@example.com'),
          })
        )
      })
    })

    it('should include email message in notification', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      const messageInput = screen.getByPlaceholderText('Add a message to include with your files...')
      
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'recipient@example.com' } })
        fireEvent.change(messageInput, { target: { value: 'Please review these files urgently.' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      await waitFor(() => {
        expect(mockData.addMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.stringContaining('Please review these files urgently.'),
          })
        )
      })
    })

    it('should reset form after successful send', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      const messageInput = screen.getByPlaceholderText('Add a message to include with your files...')
      
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'recipient@example.com' } })
        fireEvent.change(messageInput, { target: { value: 'Test message' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
        expect(emailInput).toHaveValue('')
        expect(messageInput).toHaveValue('')
      })
    })

    it('should show success message after send', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'recipient@example.com' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Files sent successfully to admin!')
      })
    })
  })

  describe('UI/UX Elements', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should show back button that navigates to dashboard', () => {
      const backButton = screen.getByTitle('Back to Dashboard')
      expect(backButton).toBeInTheDocument()
      
      fireEvent.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith('/client-portal/dashboard')
    })

    it('should disable buttons during upload/send operations', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      expect(uploadButton).toBeDisabled()
    })

    it('should show previously shared files section', () => {
      expect(screen.getByText('Previously Shared Files')).toBeInTheDocument()
      expect(screen.getByText('No files shared yet')).toBeInTheDocument()
    })

    it('should display correct file count in button text', async () => {
      const files = [
        new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['test3'], 'test3.png', { type: 'image/png' }),
      ]
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } })
      })
      
      expect(screen.getByText('Upload 3 Files')).toBeInTheDocument()
      expect(screen.getByText('Send File')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should handle empty project list gracefully', () => {
      vi.mocked(mockData.getProjectsByUserId).mockReturnValue([])
      
      renderWithAuth(mockClientUser)
      
      expect(screen.queryByDisplayValue('SpecCon')).not.toBeInTheDocument()
    })

    it('should not allow upload without files', () => {
      const uploadButton = screen.queryByText(/Upload \d+ File/)
      expect(uploadButton).not.toBeInTheDocument()
    })

    it('should not allow send without email', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const sendButton = screen.getByText('Send File')
      fireEvent.click(sendButton)
      
      expect(window.alert).toHaveBeenCalledWith('Please enter a recipient email address.')
    })
  })

  describe('Dependencies & Imports', () => {
    it('should import and use all required dependencies', () => {
      expect(() => renderWithAuth(mockClientUser)).not.toThrow()
    })

    it('should render Navbar and Footer components', () => {
      renderWithAuth(mockClientUser)
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Data Flow Integration', () => {
    beforeEach(() => {
      renderWithAuth(mockClientUser)
    })

    it('should integrate with mock data functions correctly', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const emailInput = screen.getByPlaceholderText('Enter email address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      })
      
      const sendButton = screen.getByText('Send File')
      await act(async () => {
        fireEvent.click(sendButton)
      })
      
      await waitFor(() => {
        expect(mockData.addFileShare).toHaveBeenCalledTimes(1)
        expect(mockData.addMessage).toHaveBeenCalledTimes(1)
        expect(mockData.getUsers).toHaveBeenCalledTimes(1)
      })
    })

    it('should create proper file share record structure', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText(/Upload Files/i).querySelector('input[type="file"]')!
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } })
      })
      
      const uploadButton = screen.getByText('Upload 1 File')
      await act(async () => {
        fireEvent.click(uploadButton)
      })
      
      await waitFor(() => {
        expect(mockData.addFileShare).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.stringMatching(/^file-\d+-\d+$/),
            projectId: 'proj-1',
            uploadedBy: 'user-5',
            fileName: 'test.pdf',
            fileSize: file.size,
            fileType: 'application/pdf',
            isPublic: true,
            description: 'Uploaded by client Michael Client',
            uploadedAt: expect.any(Date),
          })
        )
      })
    })
  })
})