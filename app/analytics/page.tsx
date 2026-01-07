"use client"

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

    // Load analytics data
    const projects = getProjects()
    const tickets = getTickets()
    const website = getWebsiteAnalytics()
    const social = getSocialMediaAnalytics()
    const users = getUsers()

    setAnalytics({ projects, tickets, website, social, users })
    setIsLoading(false)
  }, [user, isSignedIn, navigate])

  // Calculate metrics based on time range
  const getFilteredData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
    const cutoffDate = subDays(new Date(), days)

    return {
      recentTickets: analytics.tickets.filter(t => new Date(t.createdAt) >= cutoffDate),
      recentWebsite: analytics.website.filter(w => new Date(w.date) >= cutoffDate),
      recentSocial: analytics.social.filter(s => new Date(s.date) >= cutoffDate)
    }
  }

  const filtered = getFilteredData()

  // Calculate key metrics
  const metrics = {
    totalProjects: analytics.projects.length,
    activeProjects: analytics.projects.filter(p => p.status === "active").length,
    totalTickets: filtered.recentTickets.length,
    resolvedTickets: filtered.recentTickets.filter(t => t.status === "resolved").length,
    avgPageViews: filtered.recentWebsite.length > 0
      ? Math.round(filtered.recentWebsite.reduce((sum, w) => sum + w.pageViews, 0) / filtered.recentWebsite.length)
      : 0,
    totalEngagement: filtered.recentSocial.reduce((sum, s) => sum + s.engagement, 0),
    totalReach: filtered.recentSocial.reduce((sum, s) => sum + s.reach, 0)
  }

  // Project status distribution
  const projectStatusData = {
    active: analytics.projects.filter(p => p.status === "active").length,
    completed: analytics.projects.filter(p => p.status === "completed").length,
    paused: analytics.projects.filter(p => p.status === "paused").length
  }

  // Ticket priority distribution
  const ticketPriorityData = {
    critical: filtered.recentTickets.filter(t => t.priority === "critical").length,
    high: filtered.recentTickets.filter(t => t.priority === "high").length,
    medium: filtered.recentTickets.filter(t => t.priority === "medium").length,
    low: filtered.recentTickets.filter(t => t.priority === "low").length
  }

  // Monthly trend data (simplified)
  const monthlyTrend = [
    { month: "Jan", projects: 12, tickets: 45, revenue: 25000 },
    { month: "Feb", projects: 15, tickets: 52, revenue: 32000 },
    { month: "Mar", projects: 18, tickets: 38, revenue: 28000 },
    { month: "Apr", projects: 22, tickets: 61, revenue: 41000 },
    { month: "May", projects: 20, tickets: 49, revenue: 38000 },
    { month: "Jun", projects: 25, tickets: 55, revenue: 45000 }
  ]

  if (!user || user.role !== "admin") {
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
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Analytics Dashboard</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comprehensive insights into your business performance and project metrics
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {[
                { value: "7d", label: "7 Days" },
                { value: "30d", label: "30 Days" },
                { value: "90d", label: "90 Days" },
                { value: "1y", label: "1 Year" }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as typeof timeRange)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range.value
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-gray-800 border border-border hover:bg-muted"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
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
                  <p className="text-sm text-muted-foreground">Total Tickets ({timeRange})</p>
                  <p className="text-xs text-red-600">-5% vs last period</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.avgPageViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Avg Page Views</p>
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
                  <span className="text-sm font-bold">{projectStatusData.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <span className="text-sm font-bold">{projectStatusData.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">Paused</span>
                  </div>
                  <span className="text-sm font-bold">{projectStatusData.paused}</span>
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
                  <span className="text-sm font-bold">{ticketPriorityData.critical}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <span className="text-sm font-bold">{ticketPriorityData.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <span className="text-sm font-bold">{ticketPriorityData.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">Low</span>
                  </div>
                  <span className="text-sm font-bold">{ticketPriorityData.low}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trends Chart (Simplified) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Monthly Performance Trends</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Month</th>
                    <th className="text-left py-3 px-4 font-semibold">Projects</th>
                    <th className="text-left py-3 px-4 font-semibold">Tickets</th>
                    <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTrend.map((data, index) => (
                    <tr key={data.month} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="py-3 px-4 font-medium">{data.month}</td>
                      <td className="py-3 px-4">{data.projects}</td>
                      <td className="py-3 px-4">{data.tickets}</td>
                      <td className="py-3 px-4 font-medium">${data.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Media Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Social Media Performance ({timeRange})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                 <div className="text-3xl font-bold text-primary mb-2">{metrics.totalReach.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
                <div className="text-xs text-green-600 mt-1">+23% vs last period</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{metrics.totalEngagement.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Engagement</div>
                <div className="text-xs text-green-600 mt-1">+18% vs last period</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {metrics.totalEngagement > 0 ? Math.round((metrics.totalEngagement / metrics.totalReach) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
                <div className="text-xs text-green-600 mt-1">+5% vs last period</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}