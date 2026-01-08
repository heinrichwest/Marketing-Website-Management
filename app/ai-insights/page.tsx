"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers, getMessagesByUserId } from "@/lib/mock-data"
import type { Project, Ticket, User, Message } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// AI-powered insights and recommendations
const generateInsights = (projects: Project[], tickets: Ticket[], users: User[], messages: Message[]) => {
  const insights = []

  // Project completion insights
  const completedProjects = projects.filter(p => p.status === "completed").length
  const totalProjects = projects.length
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0

  if (completionRate > 80) {
    insights.push({
      type: "success",
      title: "Excellent Project Completion Rate",
      description: `Your team has completed ${completionRate.toFixed(1)}% of projects. This indicates high efficiency and client satisfaction.`,
      recommendation: "Consider taking on more complex projects to further challenge your team's capabilities.",
      impact: "high",
      category: "performance"
    })
  } else if (completionRate < 50) {
    insights.push({
      type: "warning",
      title: "Project Completion Rate Needs Improvement",
      description: `Only ${completionRate.toFixed(1)}% of projects are completed. This may indicate workflow inefficiencies.`,
      recommendation: "Review project management processes and consider implementing more structured workflows.",
      impact: "high",
      category: "performance"
    })
  }

  // Ticket resolution insights
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length
  const totalTickets = tickets.length
  const resolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0

  if (resolutionRate < 70) {
    insights.push({
      type: "alert",
      title: "High Open Ticket Volume",
      description: `${openTickets} tickets remain unresolved. This may impact client satisfaction.`,
      recommendation: "Reassign critical tickets and consider hiring additional support staff.",
      impact: "high",
      category: "support"
    })
  }

  // Team utilization insights
  const activeUsers = users.filter(u => u.isActive).length
  const totalUsers = users.length
  const utilizationRate = (activeUsers / totalUsers) * 100

  if (utilizationRate < 80) {
    insights.push({
      type: "info",
      title: "Underutilized Team Capacity",
      description: `${utilizationRate.toFixed(1)}% of your team is actively engaged. There may be opportunities for growth.`,
      recommendation: "Consider taking on additional projects or providing professional development opportunities.",
      impact: "medium",
      category: "team"
    })
  }

  // Communication insights
  const unreadMessages = messages.filter(m => !m.isRead).length
  if (unreadMessages > 10) {
    insights.push({
      type: "warning",
      title: "High Volume of Unread Messages",
      description: `${unreadMessages} messages are unread. This may indicate communication bottlenecks.`,
      recommendation: "Review team communication patterns and consider implementing daily standups.",
      impact: "medium",
      category: "communication"
    })
  }

  // Project timeline insights
  const overdueProjects = projects.filter(p => {
    const dueDate = new Date(p.createdAt)
    dueDate.setDate(dueDate.getDate() + 30) // Assuming 30-day projects
    return new Date() > dueDate && p.status !== "completed"
  })

  if (overdueProjects.length > 0) {
    insights.push({
      type: "urgent",
      title: "Overdue Projects Detected",
      description: `${overdueProjects.length} project(s) are behind schedule.`,
      recommendation: "Review project timelines and reallocate resources to bring projects back on track.",
      impact: "high",
      category: "timeline"
    })
  }

  // Financial insights (mock data)
  const avgProjectValue = 4500
  const monthlyRevenue = 28500
  const profitMargin = 32

  if (profitMargin > 35) {
    insights.push({
      type: "success",
      title: "Strong Profit Margins",
      description: `Your profit margin of ${profitMargin}% is above industry average.`,
      recommendation: "Consider strategic investments in team expansion or technology upgrades.",
      impact: "high",
      category: "financial"
    })
  }

  // Client satisfaction insights (mock)
  const clientSatisfaction = 4.8
  if (clientSatisfaction > 4.5) {
    insights.push({
      type: "success",
      title: "Exceptional Client Satisfaction",
      description: `Client satisfaction rating of ${clientSatisfaction}/5.0 shows outstanding service quality.`,
      recommendation: "Leverage client testimonials in marketing materials and consider referral programs.",
      impact: "high",
      category: "client"
    })
  }

  // Predictive insights
  const projectedRevenue = monthlyRevenue * 1.15
  insights.push({
    type: "info",
    title: "Revenue Growth Projection",
    description: `Based on current trends, projected monthly revenue could reach $${projectedRevenue.toLocaleString()}.`,
    recommendation: "Prepare for scaling by investing in team growth and process optimization.",
    impact: "medium",
    category: "forecasting"
  })

  // Sort by impact and type
  return insights.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 }
    const typeOrder = { urgent: 4, alert: 3, warning: 2, success: 1, info: 0 }

    if (impactOrder[a.impact as keyof typeof impactOrder] !== impactOrder[b.impact as keyof typeof impactOrder]) {
      return impactOrder[b.impact as keyof typeof impactOrder] - impactOrder[a.impact as keyof typeof impactOrder]
    }

    return typeOrder[b.type as keyof typeof typeOrder] - typeOrder[a.type as keyof typeof typeOrder]
  })
}

export default function AIInsightsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [insights, setInsights] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedImpact, setSelectedImpact] = useState<string>("all")
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    // Simulate AI analysis
    setIsAnalyzing(true)
    setTimeout(() => {
      const projects = getProjects()
      const tickets = getTickets()
      const users = getUsers()
      const messages = user ? getMessagesByUserId(user.id) : []

      const aiInsights = generateInsights(projects, tickets, users, messages)
      setInsights(aiInsights)
      setIsAnalyzing(false)
    }, 2000)
  }, [isSignedIn, user, navigate])

  const categories = [
    { value: "all", label: "All Insights" },
    { value: "performance", label: "Performance" },
    { value: "team", label: "Team" },
    { value: "client", label: "Client" },
    { value: "financial", label: "Financial" },
    { value: "communication", label: "Communication" },
    { value: "timeline", label: "Timeline" },
    { value: "forecasting", label: "Forecasting" }
  ]

  const impacts = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Impact" },
    { value: "medium", label: "Medium Impact" },
    { value: "low", label: "Low Impact" }
  ]

  const filteredInsights = insights.filter(insight => {
    const categoryMatch = selectedCategory === "all" || insight.category === selectedCategory
    const impactMatch = selectedImpact === "all" || insight.impact === selectedImpact
    return categoryMatch && impactMatch
  })

  const getTypeIcon = (type: string) => {
    const icons = {
      success: "🎉",
      warning: "⚠️",
      alert: "🚨",
      urgent: "🔴",
      info: "💡"
    }
    return icons[type as keyof typeof icons] || "📊"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      success: "border-green-500 bg-green-50 dark:bg-green-900/20",
      warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      alert: "border-orange-500 bg-orange-50 dark:bg-orange-900/20",
      urgent: "border-red-500 bg-red-50 dark:bg-red-900/20",
      info: "border-primary bg-secondary/10 dark:bg-secondary/20"
    }
    return colors[type as keyof typeof colors] || "border-gray-500 bg-gray-50 dark:bg-gray-900/20"
  }

  const getImpactBadge = (impact: string) => {
    const badges = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    }
    return badges[impact as keyof typeof badges] || "bg-gray-100 text-gray-800"
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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/admin/dashboard" className="btn-outline text-sm">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
              🤖 AI-Powered Insights
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Intelligent analysis and actionable recommendations to optimize your business performance
            </p>
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-8">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Analyzing Your Data...</h3>
                  <p className="text-muted-foreground">Our AI is processing your business metrics and generating insights</p>
                </div>
              </div>
              <div className="mt-4 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Impact Level
                </label>
                <select
                  value={selectedImpact}
                  onChange={(e) => setSelectedImpact(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  {impacts.map((impact) => (
                    <option key={impact.value} value={impact.value}>
                      {impact.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setIsAnalyzing(true)
                    setTimeout(() => {
                      const projects = getProjects()
                      const tickets = getTickets()
                      const users = getUsers()
                      const messages = user ? getMessagesByUserId(user.id) : []
                      const aiInsights = generateInsights(projects, tickets, users, messages)
                      setInsights(aiInsights)
                      setIsAnalyzing(false)
                    }, 1500)
                  }}
                  className="btn-primary px-6 py-2"
                >
                  🔄 Re-analyze
                </button>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-xl border-l-4 p-6 ${getTypeColor(insight.type)} hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getTypeIcon(insight.type)}</div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactBadge(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">
                  {insight.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {insight.description}
                </p>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">💡 Recommendation</h4>
                  <p className="text-sm text-foreground">{insight.recommendation}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{insight.category}</span>
                  <span className="capitalize">{insight.type}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredInsights.length === 0 && !isAnalyzing && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No insights found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or run a new analysis to generate insights
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedImpact("all")
                }}
                className="btn-primary"
              >
                Show All Insights
              </button>
            </div>
          )}

          {/* AI Capabilities Showcase */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 rounded-xl border border-primary/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">🚀 AI-Powered Features</h2>
              <p className="text-muted-foreground">Advanced machine learning and predictive analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-foreground mb-2">Predictive Analytics</h3>
                <p className="text-sm text-muted-foreground">Forecast trends and project outcomes</p>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-foreground mb-2">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">Actionable insights for optimization</p>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold text-foreground mb-2">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground">Identify trends and anomalies</p>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-foreground mb-2">Real-time Analysis</h3>
                <p className="text-sm text-muted-foreground">Continuous monitoring and alerts</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}