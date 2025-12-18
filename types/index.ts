// User Management Types
export type UserRole = "admin" | "web_developer" | "social_media_coordinator" | "client"

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
export type ProjectStage = "planning" | "design" | "development" | "testing" | "launch" | "maintenance"
export type ProjectStatus = "active" | "paused" | "completed"

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
  googleAnalyticsPropertyId?: string
  googleAnalyticsViewId?: string
  createdAt: Date
  launchDate?: Date
  updatedAt: Date
  notes?: string
  // Social media specific fields
  socialMediaPlatforms?: SocialMediaPlatform[]
  campaignGoals?: string
  targetAudience?: string
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

export type SocialMediaPlatform = "facebook" | "instagram" | "twitter" | "linkedin" | "tiktok" | "youtube" | "other"

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

// Activity Log Types
export interface Activity {
  id: string
  userId: string
  projectId?: string
  action: string
  description: string
  createdAt: Date
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
