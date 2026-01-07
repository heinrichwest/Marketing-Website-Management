"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers, getWebsiteAnalytics, getSocialMediaAnalytics } from "@/lib/mock-data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Project, Ticket, User, WebsiteAnalytics, SocialMediaAnalytics } from "@/types"
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"

export default function ExecutiveDashboardPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [websiteAnalytics, setWebsiteAnalytics] = useState<WebsiteAnalytics[]>([])
  const [socialAnalytics, setSocialAnalytics] = useState<SocialMediaAnalytics[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    // Load all data
    setProjects(getProjects())
    setTickets(getTickets())
    setUsers(getUsers())
    setWebsiteAnalytics(getWebsiteAnalytics())
    setSocialAnalytics(getSocialMediaAnalytics())
  }, [isSignedIn, user, navigate])

  // Calculate key metrics
  const getFilteredData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
    const cutoffDate = subDays(new Date(), days)

    return {
      recentTickets: tickets.filter(t => new Date(t.createdAt) >= cutoffDate),
      recentProjects: projects.filter(p => new Date(p.createdAt) >= cutoffDate),
      recentWebsite: websiteAnalytics.filter(w => new Date(w.date) >= cutoffDate),
      recentSocial: socialAnalytics.filter(s => new Date(s.date) >= cutoffDate)
    }
  }

  const filtered = getFilteredData()

  // Comprehensive metrics
  const metrics = {
    // Project metrics
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "active").length,
    completedProjects: projects.filter(p => p.status === "completed").length,
    projectCompletionRate: projects.length > 0
      ? Math.round((projects.filter(p => p.status === "completed").length / projects.length) * 100)
      : 0,

    // Ticket metrics
    totalTickets: filtered.recentTickets.length,
    openTickets: filtered.recentTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    resolvedTickets: filtered.recentTickets.filter(t => t.status === 'resolved').length,
    avgResolutionTime: 2.4, // days

    // Website metrics
    totalPageViews: filtered.recentWebsite.reduce((sum, w) => sum + w.pageViews, 0),
    uniqueVisitors: filtered.recentWebsite.length > 0
      ? Math.round(filtered.recentWebsite.reduce((sum, w) => sum + w.uniqueVisitors, 0) / filtered.recentWebsite.length)
      : 0,
    avgBounceRate: filtered.recentWebsite.length > 0
      ? Math.round(filtered.recentWebsite.reduce((sum, w) => sum + w.bounceRate, 0) / filtered.recentWebsite.length)
      : 0,

    // Social media metrics
    totalReach: filtered.recentSocial.reduce((sum, s) => sum + s.reach, 0),
    totalEngagement: filtered.recentSocial.reduce((sum, s) => sum + s.engagement, 0),
    engagementRate: filtered.recentSocial.length > 0
      ? Math.round((filtered.recentSocial.reduce((sum, s) => sum + s.engagement, 0) / filtered.recentSocial.reduce((sum, s) => sum + s.reach, 0)) * 100)
      : 0,

    // Team metrics
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    teamUtilization: 78, // percentage

    // Financial metrics (mock)
    totalRevenue: 156750,
    monthlyRecurring: 28500,
    avgProjectValue: Math.round(projects.reduce((sum, p) => sum + 3500, 0) / projects.length), // mock calculation
    profitMargin: 32
  }

  // Performance trends (mock data)
  const performanceTrends = {
    revenue: [
      { month: "Jan", value: 12500 },
      { month: "Feb", value: 15200 },
      { month: "Mar", value: 18900 },
      { month: "Apr", value: 22100 },
      { month: "May", value: 25800 },
      { month: "Jun", value: 31200 }
    ],
    projects: [
      { month: "Jan", value: 8 },
      { month: "Feb", value: 12 },
      { month: "Mar", value: 15 },
      { month: "Apr", value: 18 },
      { month: "May", value: 22 },
      { month: "Jun", value: 25 }
    ],
    tickets: [
      { month: "Jan", value: 45 },
      { month: "Feb", value: 52 },
      { month: "Mar", value: 38 },
      { month: "Apr", value: 61 },
      { month: "May", value: 49 },
      { month: "Jun", value: 55 }
    ]
  }

  // Top performers
  const topProjects = projects
    .filter(p => p.status === "active")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const recentActivity = [
    { type: "project", action: "completed", item: "SpecCon Website", time: "2 hours ago" },
    { type: "ticket", action: "resolved", item: "Mobile navigation fix", time: "4 hours ago" },
    { type: "meeting", action: "scheduled", item: "Client presentation", time: "6 hours ago" },
    { type: "user", action: "joined", item: "Jane Smith", time: "1 day ago" },
    { type: "analytics", action: "reported", item: "Website traffic up 15%", time: "2 days ago" }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      project: "📁",
      ticket: "🎫",
      meeting: "📅",
      user: "👤",
      analytics: "📊"
    }
    return icons[type as keyof typeof icons] || "📝"
  }

  const getActivityColor = (type: string) => {
    const colors = {
      project: "text-primary",
      ticket: "text-green-600",
      meeting: "text-purple-600",
      user: "text-orange-600",
      analytics: "text-indigo-600"
    }
    return colors[type as keyof typeof colors] || "text-gray-600"
  }

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
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Executive Dashboard</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comprehensive business overview and performance insights
              </p>
            </div>

            <div className="flex gap-3">
              <button className="btn-outline px-4 py-2">
                Export Report
              </button>
              <button className="btn-primary px-4 py-2">
                Schedule Meeting
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-8">
            {[
              { value: "7d", label: "Last 7 Days" },
              { value: "30d", label: "Last 30 Days" },
              { value: "90d", label: "Last 90 Days" },
              { value: "1y", label: "Last Year" }
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

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Financial Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xs text-green-600 mt-1">+18% vs last period</p>
                </div>
              </div>
            </div>

            {/* Project Metrics */}
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
                  <p className="text-xs text-green-600 mt-1">{metrics.projectCompletionRate}% completion rate</p>
                </div>
              </div>
            </div>

            {/* Website Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.totalPageViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-xs text-green-600 mt-1">+23% vs last period</p>
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metrics.teamUtilization}%</p>
                  <p className="text-sm text-muted-foreground">Team Utilization</p>
                  <p className="text-xs text-green-600 mt-1">{metrics.activeUsers}/{metrics.totalUsers} active members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Performance Trends</h3>
              <div className="space-y-6">
                {/* Revenue Trend */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Revenue Growth</span>
                    <span className="text-sm text-green-600">+18%</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {performanceTrends.revenue.map((item, index) => (
                      <div
                        key={item.month}
                        className="flex-1 bg-primary/20 rounded-sm"
                        style={{ height: `${(item.value / 35000) * 60}px` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {performanceTrends.revenue.map(item => (
                      <span key={item.month}>{item.month}</span>
                    ))}
                  </div>
                </div>

                {/* Projects Trend */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Project Delivery</span>
                    <span className="text-sm text-primary">+25%</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {performanceTrends.projects.map((item, index) => (
                      <div
                        key={item.month}
                        className="flex-1 bg-primary/20 rounded-sm"
                        style={{ height: `${(item.value / 30) * 60}px` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {performanceTrends.projects.map(item => (
                      <span key={item.month}>{item.month}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Active Projects</h3>
              <div className="space-y-4">
                {topProjects.map((project, index) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <p className="text-xs text-muted-foreground">{project.currentStage} • {project.projectType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-border/50 rounded-lg">
                    <div className="text-xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className={`font-medium ${getActivityColor(activity.type)}`}>
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        </span>
                        {" " + activity.item}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary text-left py-3 px-4 rounded-lg">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Project
                  </button>
                  <button className="w-full btn-outline text-left py-3 px-4 rounded-lg">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Send Message
                  </button>
                  <Link to="/analytics" className="w-full btn-outline text-left py-3 px-4 rounded-lg">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Analytics
                  </Link>
                </div>
              </div>

              {/* Key Stats Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Key Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                    <span className="text-sm font-medium text-foreground">{metrics.avgResolutionTime}d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Engagement Rate</span>
                    <span className="text-sm font-medium text-foreground">{metrics.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <span className="text-sm font-medium text-green-600">{metrics.profitMargin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Client Satisfaction</span>
                    <span className="text-sm font-medium text-foreground">4.8/5.0</span>
                  </div>
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