import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { UserRole, ProjectStage, TicketStatus, TicketPriority, TicketType, ProjectStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return formatDate(d)
}

// String utilities
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + "..."
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

// Role utilities
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: "Administrator",
    web_developer: "Web Developer",
    social_media_coordinator: "Social Media Coordinator",
    client: "Client",
  }
  return roleNames[role]
}

export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    web_developer: "bg-primary/10 text-primary border-primary/20",
    social_media_coordinator: "bg-accent/10 text-accent border-accent/20",
    client: "bg-success/10 text-success border-success/20",
  }
  return roleColors[role]
}

// Test example list of all user roles
export const userRoles: UserRole[] = [
  "admin",
  "web_developer",
  "social_media_coordinator",
  "client"
]

// Project stage utilities
export function getStageDisplayName(stage: ProjectStage): string {
  const stageNames: Record<ProjectStage, string> = {
    planning: "Planning",
    design: "Design",
    development: "Development",
    testing: "Testing",
    seo_optimization: "SEO Optimization",
    launch: "Launch",
    maintenance: "Maintenance",
  }
  return stageNames[stage]
}

export function getStageOrder(stage: ProjectStage): number {
  const stageOrder: Record<ProjectStage, number> = {
    planning: 0,
    design: 1,
    development: 2,
    testing: 3,
    seo_optimization: 4,
    launch: 5,
    maintenance: 6,
  }
  return stageOrder[stage]
}

export function getNextStage(currentStage: ProjectStage): ProjectStage | null {
  const stages: ProjectStage[] = ["planning", "design", "development", "testing", "seo_optimization", "launch", "maintenance"]
  const currentIndex = stages.indexOf(currentStage)
  if (currentIndex === -1 || currentIndex === stages.length - 1) return null
  return stages[currentIndex + 1]
}

export function getStageProgress(stage: ProjectStage): number {
  const stageProgress: Record<ProjectStage, number> = {
    planning: 14.29,
    design: 28.57,
    development: 42.86,
    testing: 57.14,
    seo_optimization: 71.43,
    launch: 85.71,
    maintenance: 100,
  }
  return stageProgress[stage]
}

// Status utilities
export function getStatusColor(status: TicketStatus | ProjectStatus): string {
  const statusColors: Record<string, string> = {
    open: "bg-blue-100 text-blue-700 border-blue-200",
    in_progress: "bg-yellow-100 text-yellow-700 border-yellow-200",
    resolved: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
    active: "bg-green-100 text-green-700 border-green-200",
    paused: "bg-gray-100 text-gray-700 border-gray-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  }
  return statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200"
}

export function getStatusDisplayName(status: TicketStatus | ProjectStatus): string {
  const statusNames: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
    active: "Active",
    paused: "Paused",
    completed: "Completed",
  }
  return statusNames[status] || capitalize(status)
}

// Priority utilities
export function getPriorityColor(priority: TicketPriority): string {
  const priorityColors: Record<TicketPriority, string> = {
    low: "bg-gray-100 text-gray-700 border-gray-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  }
  return priorityColors[priority]
}

export function getPriorityDisplayName(priority: TicketPriority): string {
  return capitalize(priority)
}

// Ticket type utilities
export function getTicketTypeDisplayName(type: TicketType): string {
  const typeNames: Record<TicketType, string> = {
    bug_report: "Bug Report",
    content_change: "Content Change",
    design_update: "Design Update",
    feature_request: "Feature Request",
  }
  return typeNames[type]
}

export function getTicketTypeColor(type: TicketType): string {
  const typeColors: Record<TicketType, string> = {
    bug_report: "bg-red-100 text-red-700 border-red-200",
    content_change: "bg-blue-100 text-blue-700 border-blue-200",
    design_update: "bg-purple-100 text-purple-700 border-purple-200",
    feature_request: "bg-green-100 text-green-700 border-green-200",
  }
  return typeColors[type]
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-ZA").format(num)
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`
}

export function formatCurrency(num: number): string {
  return `R ${formatNumber(num)}`
}

// ID generation
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}-${timestamp}-${random}`
}

// User initials
export function getUserInitials(fullName: string): string {
  const names = fullName.trim().split(" ")
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>,
  )
}

export function sortBy<T>(array: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === "asc" ? -1 : 1
    if (aVal > bVal) return order === "asc" ? 1 : -1
    return 0
  })
}
