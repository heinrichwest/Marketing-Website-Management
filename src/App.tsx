import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/auth-context'
import { ThemeProvider } from '@/components/theme-provider'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminProjectsPage from './pages/admin/ProjectsPage'
import AdminNotificationsPage from './pages/admin/NotificationsPage'
import NewUserPage from './pages/admin/NewUserPage'
import DeveloperDashboardPage from './pages/developer/DashboardPage'
import DeveloperTicketsPage from './pages/developer/TicketsPage'
import CoordinatorDashboardPage from './pages/coordinator/DashboardPage'
import ClientDashboardPage from './pages/client/DashboardPage'
import ClientProjectsPage from './pages/client/ProjectsPage'
import ClientTicketsPage from './pages/client/TicketsPage'
import ClientNewTicketPage from './pages/client/tickets/NewTicketPage'
import SwitchRolePage from './pages/SwitchRolePage'
import NewProjectPage from './pages/admin/NewProjectPage'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="marketing-website-theme">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* General Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/new" element={<NewUserPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/projects/new" element={<NewProjectPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />

          {/* Developer Routes */}
          <Route path="/developer/dashboard" element={<DeveloperDashboardPage />} />
          <Route path="/developer/tickets" element={<DeveloperTicketsPage />} />

          {/* Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboardPage />} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
          <Route path="/client/projects" element={<ClientProjectsPage />} />
          <Route path="/client/tickets" element={<ClientTicketsPage />} />
          <Route path="/client/tickets/new" element={<ClientNewTicketPage />} />

          {/* Role Switch */}
          <Route path="/switch-role" element={<SwitchRolePage />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
