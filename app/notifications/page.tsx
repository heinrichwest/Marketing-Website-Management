"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format } from "date-fns"

interface NotificationItem {
  id: string
  type: 'project' | 'ticket' | 'message' | 'deadline' | 'meeting' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  sender?: string
  metadata?: Record<string, any>
}

export default function NotificationsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  // Mock notifications data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      type: "project",
      title: "Project Status Updated",
      message: "SpecCon website project has moved to the testing phase",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      actionUrl: "/client-portal/project/proj-1",
      priority: "medium",
      sender: "John Developer",
      metadata: { projectId: "proj-1", oldStatus: "development", newStatus: "testing" }
    },
    {
      id: "notif-2",
      type: "deadline",
      title: "Upcoming Deadline",
      message: "Andebe platform development deadline is approaching (2 days remaining)",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      actionUrl: "/calendar",
      priority: "high",
      metadata: { projectId: "proj-2", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) }
    },
    {
      id: "notif-3",
      type: "message",
      title: "New Message from Client",
      message: "Emma Business sent you a message about the Venueideas project",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      actionUrl: "/messages",
      priority: "medium",
      sender: "Emma Business",
      metadata: { messageId: "message-6", projectId: "proj-10" }
    },
    {
      id: "notif-4",
      type: "meeting",
      title: "Meeting Reminder",
      message: "Client presentation meeting starts in 1 hour",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      actionUrl: "/calendar",
      priority: "urgent",
      metadata: { meetingId: "event-3", startTime: new Date(Date.now() + 1000 * 60 * 45) }
    },
    {
      id: "notif-5",
      type: "ticket",
      title: "Ticket Assigned",
      message: "New bug report assigned to you: Mobile navigation issue",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      actionUrl: "/developer/tickets",
      priority: "high",
      sender: "Admin User",
      metadata: { ticketId: "ticket-2", priority: "high" }
    },
    {
      id: "notif-6",
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance will begin tonight at 10 PM",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      priority: "low",
      metadata: { maintenanceStart: new Date(Date.now() + 1000 * 60 * 60 * 2) }
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Simulate real-time notifications (add new ones periodically)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification every 5 minutes (in real app, this would be WebSocket)
      if (Math.random() < 0.1) { // 10% chance every 5 seconds (simulating 5 minutes)
        const newNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: ['project', 'ticket', 'message', 'deadline'][Math.floor(Math.random() * 4)] as any,
          title: "New Activity",
          message: "Something happened in your workspace",
          read: false,
          createdAt: new Date(),
          priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' ||
                             (filter === 'unread' && !notification.read) ||
                             (filter === 'read' && notification.read)

    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter

    return matchesReadFilter && matchesTypeFilter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      project: "📁",
      ticket: "🎫",
      message: "💬",
      deadline: "⏰",
      meeting: "📅",
      system: "⚙️"
    }
    return icons[type as keyof typeof icons] || "📄"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "border-l-green-500 bg-green-50 dark:bg-green-900/20",
      medium: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      high: "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20",
      urgent: "border-l-red-500 bg-red-50 dark:bg-red-900/20"
    }
    return colors[priority as keyof typeof colors] || "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return format(date, "MMM dd")
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
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Notifications</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Stay updated with real-time activity and important alerts
                {unreadCount > 0 && (
                  <span className="inline-flex items-center gap-2 ml-3 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                    </svg>
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn-outline"
                >
                  Mark All Read
                </button>
              )}
              <button className="btn-primary">
                Notification Settings
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Read/Unread Filter */}
              <div className="flex gap-2">
                <span className="text-sm font-medium text-foreground mr-2">Status:</span>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'unread', label: 'Unread' },
                  { value: 'read', label: 'Read' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as typeof filter)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filter === option.value
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex gap-2">
                <span className="text-sm font-medium text-foreground mr-2">Type:</span>
                {[
                  { value: 'all', label: 'All Types' },
                  { value: 'project', label: 'Projects' },
                  { value: 'ticket', label: 'Tickets' },
                  { value: 'message', label: 'Messages' },
                  { value: 'meeting', label: 'Meetings' },
                  { value: 'deadline', label: 'Deadlines' },
                  { value: 'system', label: 'System' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypeFilter(option.value)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      typeFilter === option.value
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 transition-all duration-200 hover:shadow-md ${
                    !notification.read ? `border-l-4 ${getPriorityColor(notification.priority)}` : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                          {getTypeIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority}
                          </span>

                          {notification.sender && (
                            <span className="text-muted-foreground">
                              From: {notification.sender}
                            </span>
                          )}

                          <span className="text-muted-foreground capitalize">
                            {notification.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {notification.actionUrl && (
                        <button
                          onClick={() => navigate(notification.actionUrl!)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          View
                        </button>
                      )}

                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="btn-outline text-sm px-3 py-1"
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete notification"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m0 0v2a2 2 0 004 0v-2m-4-6h8" />
                </svg>
                <h3 className="text-xl font-semibold text-foreground mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' ? 'All caught up! No unread notifications.' :
                   typeFilter !== 'all' ? `No ${typeFilter} notifications found.` :
                   'You have no notifications at this time.'}
                </p>
              </div>
            )}
          </div>

          {/* Notification Settings Preview */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10 p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Notification Preferences</h3>
            <p className="text-muted-foreground mb-6">
              Customize when and how you receive notifications to stay informed without being overwhelmed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border/50">
                <h4 className="font-semibold text-foreground mb-2">Project Updates</h4>
                <p className="text-sm text-muted-foreground mb-3">Status changes, new milestones</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">In-app</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border/50">
                <h4 className="font-semibold text-foreground mb-2">Ticket Activity</h4>
                <p className="text-sm text-muted-foreground mb-3">New assignments, updates</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">In-app</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border/50">
                <h4 className="font-semibold text-foreground mb-2">Meeting Reminders</h4>
                <p className="text-sm text-muted-foreground mb-3">Upcoming meetings, deadlines</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">In-app</span>
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