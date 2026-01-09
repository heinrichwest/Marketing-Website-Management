import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getWebsiteAnalytics, getSocialMediaAnalytics, getUsers } from "@/lib/mock-data"
import type { Project, Ticket, WebsiteAnalytics, SocialMediaAnalytics, User } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"

export default function AnalyticsDashboardPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [analytics, setAnalytics] = useState({
    projects: [] as Project[],
    tickets: [] as Ticket[],
    website: [] as WebsiteAnalytics[],
    social: [] as SocialMediaAnalytics[],
    users: [] as User[]
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    // Load admin analytics data
    const projects = getProjects()
    const tickets = getTickets()
    const website = getWebsiteAnalytics()
    const social = getSocialMediaAnalytics()
    const users = getUsers()

    setAnalytics({ projects, tickets, website, social, users })
    setIsLoading(false)
  }, [user, isSignedIn, navigate])

  const metrics = {
    totalProjects: analytics.projects.length,
    activeProjects: analytics.projects.filter(p => p.status === "active").length,
    totalTickets: analytics.tickets.length,
    resolvedTickets: analytics.tickets.filter(t => t.status === "resolved").length,
    avgPageViews: analytics.website.length > 0
      ? Math.round(analytics.website.reduce((sum, w) => sum + w.pageViews, 0) / analytics.website.length)
      : 0,
    totalEngagement: analytics.social.reduce((sum, s) => sum + s.engagement, 0),
    totalReach: analytics.social.reduce((sum, s) => sum + s.reach, 0)
  }

  if (isLoading) {
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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comprehensive insights into your business performance and project metrics
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.totalProjects}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-xs text-green-600">+12% vs last period</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-xs text-green-600">+8% vs last period</p>
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
                  <p className="text-2xl font-bold text-foreground">{metrics.totalTickets}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-xs text-red-600">-5% vs last period</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{analytics.users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xs text-green-600">+15% vs last period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Project Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Project Status Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.projects.filter(p => p.status === "active").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.projects.filter(p => p.status === "completed").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">Paused</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.projects.filter(p => p.status === "paused").length}</span>
                </div>
              </div>
            </div>

            {/* Ticket Priority Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Ticket Priority Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium">Critical</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.tickets.filter(t => t.priority === "critical").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.tickets.filter(t => t.priority === "high").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.tickets.filter(t => t.priority === "medium").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">Low</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.tickets.filter(t => t.priority === "low").length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {analytics.tickets.slice(0, 5).map((ticket) => {
                const project = analytics.projects.find(p => p.id === ticket.projectId)
                return (
                  <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        ticket.priority === 'critical' ? 'bg-red-500' :
                        ticket.priority === 'high' ? 'bg-orange-500' :
                        ticket.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-foreground">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {project?.name} • {format(ticket.createdAt, "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                      ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                )
              })}
              {analytics.tickets.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}