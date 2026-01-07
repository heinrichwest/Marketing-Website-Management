"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers, getMessagesByUserId } from "@/lib/mock-data"
import type { Project, Ticket, User, Message } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format } from "date-fns"

export default function EnhancedDashboardPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    // Load all data
    const projectsData = getProjects()
    const ticketsData = getTickets()
    const usersData = getUsers()
    const messagesData = user ? getMessagesByUserId(user.id) : []

    setProjects(projectsData)
    setTickets(ticketsData)
    setUsers(usersData)
    setMessages(messagesData)
    setIsLoading(false)
  }, [isSignedIn, user, navigate])

  // Calculate dashboard metrics
  const metrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "active").length,
    completedProjects: projects.filter(p => p.status === "completed").length,
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    unreadMessages: messages.filter(m => !m.isRead && m.recipientId === user?.id).length,
    totalRevenue: 156750, // Mock data
    monthlyGrowth: 18.5
  }

  // Recent activity
  const recentActivity = [
    {
      type: "project",
      action: "completed",
      item: "SpecCon Website",
      user: "John Developer",
      time: "2 hours ago",
      icon: "📁"
    },
    {
      type: "ticket",
      action: "resolved",
      item: "Mobile navigation fix",
      user: "Jane Smith",
      time: "4 hours ago",
      icon: "🎫"
    },
    {
      type: "message",
      action: "sent",
      item: "Client feedback received",
      user: "Emma Business",
      time: "6 hours ago",
      icon: "💬"
    },
    {
      type: "meeting",
      action: "scheduled",
      item: "Project review meeting",
      user: "Admin User",
      time: "1 day ago",
      icon: "📅"
    }
  ]

  // Quick actions based on user role
  const getQuickActions = () => {
    if (!user) return []

    switch (user.role) {
      case "admin":
        return [
          { title: "New Project", description: "Create a new project", icon: "📁", action: "/admin/projects/new", color: "bg-primary" },
          { title: "Manage Users", description: "Add or edit team members", icon: "👥", action: "/admin/users", color: "bg-green-500" },
          { title: "View Analytics", description: "Business performance data", icon: "📊", action: "/analytics", color: "bg-purple-500" },
          { title: "System Reports", description: "Executive dashboard", icon: "📈", action: "/reports", color: "bg-orange-500" }
        ]
      case "web_developer":
        return [
          { title: "My Tickets", description: "Assigned development tasks", icon: "🎫", action: "/developer/tickets", color: "bg-primary" },
          { title: "My Projects", description: "Social media campaigns", icon: "📱", action: "/coordinator/projects", color: "bg-primary" },
          { title: "Project Status", description: "View project progress", icon: "📊", action: "/client-portal/dashboard", color: "bg-primary" },
          { title: "Submit Feedback", description: "Rate our work", icon: "⭐", action: "/client-portal/feedback", color: "bg-green-500" },
          { title: "Share Files", description: "Upload project assets", icon: "📎", action: "/client-portal/files", color: "bg-purple-500" },
          { title: "Message Team", description: "Contact your team", icon: "💬", action: "/messages", color: "bg-orange-500" }
        ]
      default:
        return []
    }
  }

  // Priority alerts
  const priorityAlerts = [
    {
      type: "deadline",
      title: "Project Deadline Approaching",
      message: "Andebe platform development deadline is in 2 days",
      priority: "high",
      action: "/calendar"
    },
    {
      type: "ticket",
      title: "High Priority Ticket",
      message: "Critical bug reported in production system",
      priority: "urgent",
      action: "/tickets"
    },
    {
      type: "meeting",
      title: "Meeting Reminder",
      message: "Client presentation in 1 hour",
      priority: "medium",
      action: "/calendar"
    }
  ]

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "border-green-500 bg-green-50 dark:bg-green-900/20",
      medium: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      high: "border-orange-500 bg-orange-50 dark:bg-orange-900/20",
      urgent: "border-red-500 bg-red-50 dark:bg-red-900/20"
    }
    return colors[priority as keyof typeof colors] || "border-gray-500 bg-gray-50 dark:bg-gray-900/20"
  }

  const getPriorityIcon = (priority: string) => {
    const icons = {
      low: "🟢",
      medium: "🟡",
      high: "🟠",
      urgent: "🔴"
    }
    return icons[priority as keyof typeof icons] || "⚪"
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Welcome back, {user.fullName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Here's what's happening in your workspace today
            </p>
          </div>

          {/* Priority Alerts */}
          {priorityAlerts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Priority Alerts</h2>
              <div className="space-y-4">
                {priorityAlerts.map((alert, index) => (
                  <Link
                    key={index}
                    to={alert.action}
                    className={`block p-4 rounded-xl border-l-4 ${getPriorityColor(alert.priority)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getPriorityIcon(alert.priority)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <p className="text-muted-foreground text-sm">{alert.message}</p>
                      </div>
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.resolvedTickets}</p>
                  <p className="text-sm text-muted-foreground">Tickets Resolved</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">Active Team Members</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${metrics.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getQuickActions().map((action, index) => (
                    <Link
                      key={index}
                      to={action.action}
                      className="group p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                    <div className="text-lg">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <Link to="/notifications" className="text-primary hover:underline text-sm font-medium">
                  View all notifications →
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Server Status</span>
                  <span className="inline-flex items-center gap-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="inline-flex items-center gap-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Healthy
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">API Response</span>
                  <span className="text-sm font-medium text-green-600">120ms</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Team Productivity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Daily Hours</span>
                  <span className="text-sm font-medium">6.8h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tickets/Day</span>
                  <span className="text-sm font-medium">4.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-medium text-green-600">2.1h</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Client Satisfaction</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overall Rating</span>
                  <span className="text-sm font-medium">4.8/5.0 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Rate</span>
                  <span className="text-sm font-medium text-green-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Retention Rate</span>
                  <span className="text-sm font-medium text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}