// User Management Types
export type UserRole =
  | "admin"
  | "web_developer"
  | "social_media_coordinator"
  | "client"

export interface User {
  id: string
  email: string
  password: string // hashed in production
  fullName: string
  phone: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  profileImage?: string
}

// Project Management Types
export type ProjectType = "website" | "social_media"
export type ProjectStage = "planning" | "design" | "development" | "testing" | "seo_optimization" | "launch" | "maintenance"
export type ProjectStatus = "active" | "paused" | "completed"
export type ProductType = "Learnerships" | "Academy" | "Employment Equity" | "Venueideas" | "Trouidees"

export interface Project {
  id: string
  name: string
  description: string
  projectType: ProjectType
  clientId: string
  webDeveloperId?: string
  socialMediaCoordinatorId?: string
  currentStage: ProjectStage
  status: ProjectStatus
  websiteUrl?: string
  brand?: string // Brand name
  createdAt: Date
  launchDate?: Date
  updatedAt: Date
  notes?: string
  projectDate?: Date // Date of the project
  product?: ProductType // Product type
  // Social media specific fields
  socialMediaPlatforms?: SocialMediaPlatform[]
  campaignGoals?: string
  targetAudience?: string
  // Social media metrics
  posts?: number
  likes?: number
  impressions?: number
  reach?: number
  engagement?: number
}

export interface ProjectStageHistory {
  id: string
  projectId: string
  stage: ProjectStage
  startDate: Date
  endDate?: Date
  status: "in_progress" | "completed" | "blocked"
  notes?: string
  completedBy?: string
}

// Ticket Management Types
export type TicketType = "bug_report" | "content_change" | "design_update" | "feature_request"
export type TicketPriority = "low" | "medium" | "high" | "critical"
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"

export interface Ticket {
  id: string
  projectId: string
  createdBy: string
  assignedTo?: string
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  resolutionNotes?: string
  attachments?: string[]
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
  isEdited: boolean
}

// Analytics Types
export interface WebsiteAnalytics {
  id: string
  projectId: string
  date: Date
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  averageSessionDuration?: number
  topPages?: { page: string; views: number }[]
  recordedBy: string
  createdAt: Date
}

export type SocialMediaPlatform = "Facebook" | "Instagram" | "Twitter" | "LinkedIn" | "TikTok" | "YouTube" | "Pinterest" | "Snapchat" | "other"

export interface SocialMediaAnalytics {
  id: string
  projectId: string
  platform: SocialMediaPlatform
  date: Date
  posts: number
  engagement: number
  reach: number
  followers?: number
  likes?: number
  comments?: number
  shares?: number
  recordedBy: string
  createdAt: Date
  notes?: string
}

// Monthly Analytics Types
export interface MonthlyAnalytics {
  id: string
  projectId: string // Associated project
  projectName?: string // Store project name for display
  month: string // Format: "YYYY-MM" (e.g., "2024-11")
  userEngagement: number
  newUsers: number
  clicks: number
  referrals: number
  recordedBy: string
  createdAt: Date
  updatedAt: Date
  notes?: string
}

// Message/Notification Types
export interface Message {
  id: string
  senderId: string
  recipientId?: string // null for broadcast messages
  subject: string
  content: string
  isRead: boolean
  isBroadcast: boolean // true if sent to all users
  projectId?: string // optional association with project
  createdAt: Date
  updatedAt: Date
}

// Activity Log Types
export interface Activity {
  id: string
  userId: string
  projectId?: string
  action: string
  description: string
  createdAt: Date
}

// Client Portal Types
export interface ClientPortalAccess {
  id: string
  clientId: string
  projectId: string
  canViewProgress: boolean
  canViewFiles: boolean
  canDownloadFiles: boolean
  canSubmitFeedback: boolean
  canMessageTeam: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ClientFeedback {
  id: string
  clientId: string
  projectId: string
  rating: number // 1-5 stars
  feedback: string
  category: 'design' | 'functionality' | 'communication' | 'timeline' | 'overall'
  isPublic: boolean
  response?: string
  responseBy?: string
  responseAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FileShare {
  id: string
  projectId: string
  uploadedBy: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  isPublic: boolean // visible to client
  description?: string
  uploadedAt: Date
}

// Calendar & Scheduling Types
export type EventType = 'meeting' | 'deadline' | 'milestone' | 'review' | 'maintenance' | 'kickoff' | 'presentation'
export type EventPriority = 'low' | 'medium' | 'high' | 'critical'
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  eventType: EventType
  priority: EventPriority
  startDate: Date
  endDate: Date
  allDay: boolean
  location?: string
  attendees: string[] // User IDs
  organizerId: string
  projectId?: string
  isRecurring: boolean
  recurrenceType: RecurrenceType
  recurrenceEndDate?: Date
  reminderMinutes: number // Minutes before event to send reminder
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MeetingRoom {
  id: string
  name: string
  capacity: number
  location: string
  amenities: string[]
  isAvailable: boolean
}

export interface TimeBlock {
  id: string
  userId: string
  title: string
  startTime: Date
  endTime: Date
  type: 'busy' | 'available' | 'tentative'
  eventId?: string
}

// Time Tracking Types
export type TimeEntryType = 'development' | 'design' | 'meeting' | 'review' | 'planning' | 'testing' | 'maintenance' | 'other'
export type TimerStatus = 'stopped' | 'running' | 'paused'

export interface TimeEntry {
  id: string
  userId: string
  projectId?: string
  ticketId?: string
  description: string
  entryType: TimeEntryType
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  isBillable: boolean
  hourlyRate?: number
  tags: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TimerSession {
  id: string
  userId: string
  projectId?: string
  ticketId?: string
  description: string
  entryType: TimeEntryType
  startTime: Date
  endTime?: Date
  status: TimerStatus
  accumulatedTime: number // in minutes
  isBillable: boolean
  hourlyRate?: number
  tags: string[]
}

export interface TimeReport {
  id: string
  userId: string
  projectId?: string
  period: 'daily' | 'weekly' | 'monthly' | 'custom'
  startDate: Date
  endDate: Date
  totalHours: number
  billableHours: number
  totalAmount?: number
  entries: TimeEntry[]
  generatedAt: Date
}

// Project Template Types
export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: 'website' | 'social_media' | 'branding' | 'ecommerce' | 'mobile' | 'custom'
  estimatedDuration: number // in days
  estimatedBudget: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date

  // Template structure
  phases: ProjectPhaseTemplate[]
  deliverables: DeliverableTemplate[]
  teamRoles: TeamRoleTemplate[]
  checklists: ChecklistTemplate[]
}

export interface ProjectPhaseTemplate {
  id: string
  name: string
  description: string
  order: number
  estimatedDuration: number // in days
  dependencies: string[] // phase IDs this depends on
  deliverables: string[] // deliverable IDs
}

export interface DeliverableTemplate {
  id: string
  name: string
  description: string
  phaseId: string
  type: 'document' | 'design' | 'code' | 'content' | 'media' | 'other'
  estimatedHours: number
  isRequired: boolean
}

export interface TeamRoleTemplate {
  id: string
  role: string
  required: boolean
  estimatedHours: number
  skills: string[]
}

export interface ChecklistTemplate {
  id: string
  name: string
  description: string
  phaseId: string
  items: ChecklistItemTemplate[]
}

export interface ChecklistItemTemplate {
  id: string
  description: string
  isRequired: boolean
  estimatedHours: number
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProjects?: number
  activeProjects?: number
  totalUsers?: number
  openTickets?: number
  assignedProjects?: number
  inProgressTickets?: number
  totalReach?: number
  totalEngagement?: number
  activeTickets?: number
}

// Project with populated relations
export interface ProjectWithRelations extends Project {
  client?: User
  webDeveloper?: User
  socialMediaCoordinator?: User
  tickets?: Ticket[]
  stageHistory?: ProjectStageHistory[]
}

// Ticket with populated relations
export interface TicketWithRelations extends Ticket {
  project?: Project
  createdByUser?: User
  assignedToUser?: User
  comments?: Comment[]
}
