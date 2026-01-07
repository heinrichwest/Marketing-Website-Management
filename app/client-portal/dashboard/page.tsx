"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getTicketsByUserId, getMessagesByUserId } from "@/lib/mock-data"
import type { Project, Ticket, Message } from "@/types"
import { format } from "date-fns"

export default function ClientPortalDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate("/login?portal=client")
      return
    }

    if (user.role !== "client") {
      navigate("/dashboard")
      return
    }

    // Load client data
    setProjects(getProjectsByUserId(user.id, user.role))
    setTickets(getTicketsByUserId(user.id, user.role))
    setMessages(getMessagesByUserId(user.id))
    setIsLoading(false)
  }, [user, navigate])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/login?portal=client")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const activeProjects = projects.filter(p => p.status === "active")
  const recentTickets = tickets.slice(0, 3)
  const unreadMessages = messages.filter(msg =>
    !msg.isRead && msg.recipientId === user?.id
  )

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
             <Link to="/client-portal/dashboard" className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                 <img src="/Logo.png" alt="Marketing Website Logo" className="h-10 w-auto" />
                 <div>
                   <h1 className="text-xl font-bold text-primary">Client Portal</h1>
                   <p className="text-sm text-muted-foreground">Welcome, {user.fullName}</p>
                 </div>
               </div>
             </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/messages"
                className="p-2 rounded-lg hover:bg-muted transition-colors relative"
                title="Messages"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadMessages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadMessages.length > 99 ? '99+' : unreadMessages.length}
                  </span>
                )}
              </Link>

              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Project Dashboard</h2>
          <p className="text-muted-foreground">Track your project progress and communicate with our team</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeProjects.length}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadMessages.length}</p>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Your Projects</h3>
               <span className="text-muted-foreground text-sm">
                 Recent Projects
               </span>
            </div>

            <div className="space-y-4">
              {activeProjects.length > 0 ? (
                activeProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    to={`/client-portal/project/${project.id}`}
                    className="block p-4 border border-border/50 rounded-lg hover:bg-muted/50 hover:border-primary/20 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stage: {project.currentStage}</span>
                      <span>Updated {format(project.updatedAt, "MMM dd")}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-muted-foreground">No active projects yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
               <Link to="/client/tickets" className="text-primary hover:underline text-sm">
                 View All Tickets
               </Link>
            </div>

            <div className="space-y-4">
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{ticket.title}</h4>
                      <p className="text-xs text-muted-foreground">Status: {ticket.status}</p>
                      <p className="text-xs text-muted-foreground">{format(ticket.createdAt, "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}