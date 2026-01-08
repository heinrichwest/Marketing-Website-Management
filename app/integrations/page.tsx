"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Mock integration data
const availableIntegrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Connect your workspace for real-time notifications and team communication",
    category: "communication",
    status: "available",
    icon: "💬",
    features: ["Real-time notifications", "Channel integration", "Team mentions", "Status updates"],
    setupSteps: ["Authorize Slack workspace", "Select notification channels", "Configure message templates", "Test integration"],
    pricing: "Free"
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync your calendar with Google Calendar for seamless scheduling",
    category: "productivity",
    status: "available",
    icon: "📅",
    features: ["Two-way sync", "Meeting invites", "Availability sharing", "Reminder integration"],
    setupSteps: ["Connect Google account", "Grant calendar permissions", "Select calendars to sync", "Configure sync settings"],
    pricing: "Free"
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows by connecting with 5,000+ apps",
    category: "automation",
    status: "available",
    icon: "⚡",
    features: ["Workflow automation", "App integrations", "Custom triggers", "Data synchronization"],
    setupSteps: ["Create Zapier account", "Generate API key", "Configure webhooks", "Test automation flows"],
    pricing: "$29.99/month"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync client data and automate email campaigns",
    category: "marketing",
    status: "available",
    icon: "📧",
    features: ["Contact synchronization", "Automated campaigns", "Performance tracking", "List management"],
    setupSteps: ["Connect Mailchimp account", "Map data fields", "Configure sync rules", "Set up automation triggers"],
    pricing: "Free to $299/month"
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and manage billing automatically",
    category: "financial",
    status: "coming_soon",
    icon: "💳",
    features: ["Payment processing", "Invoice generation", "Subscription management", "Financial reporting"],
    setupSteps: ["Connect Stripe account", "Configure payment methods", "Set up webhooks", "Test payment flow"],
    pricing: "2.9% + 30¢ per transaction"
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track development progress and code deployments",
    category: "development",
    status: "available",
    icon: "💻",
    features: ["Repository monitoring", "Deployment tracking", "Issue synchronization", "Code review integration"],
    setupSteps: ["Authorize GitHub account", "Select repositories", "Configure webhooks", "Set up notifications"],
    pricing: "Free"
  },
  {
    id: "figma",
    name: "Figma",
    description: "Sync design files and track creative project progress",
    category: "design",
    status: "coming_soon",
    icon: "🎨",
    features: ["File synchronization", "Version tracking", "Comment integration", "Design handoff"],
    setupSteps: ["Connect Figma account", "Select design files", "Configure sync settings", "Set up notifications"],
    pricing: "Free to $144/year"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM integration for lead management and client tracking",
    category: "crm",
    status: "available",
    icon: "🎯",
    features: ["Lead synchronization", "Contact management", "Deal tracking", "Email integration"],
    setupSteps: ["Connect HubSpot account", "Map data fields", "Configure sync rules", "Set up automation"],
    pricing: "Free to $3,600/month"
  }
]

const connectedIntegrations = [
  {
    id: "slack-connected",
    integrationId: "slack",
    status: "connected",
    connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    settings: {
      channels: ["#general", "#projects", "#client-updates"],
      notifications: ["project_updates", "deadline_alerts", "client_messages"]
    }
  },
  {
    id: "google-calendar-connected",
    integrationId: "google-calendar",
    status: "connected",
    connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    settings: {
      calendars: ["Work Calendar", "Client Meetings"],
      syncDirection: "two-way",
      reminderTime: 15
    }
  }
]

export default function APIIntegrationsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }
  }, [isSignedIn, user, navigate])

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "communication", label: "Communication" },
    { value: "productivity", label: "Productivity" },
    { value: "automation", label: "Automation" },
    { value: "marketing", label: "Marketing" },
    { value: "financial", label: "Financial" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "crm", label: "CRM" }
  ]

  const filteredIntegrations = availableIntegrations.filter(integration =>
    selectedCategory === "all" || integration.category === selectedCategory
  )

  const handleConnect = async (integrationId: string) => {
    setConnectingIntegration(integrationId)

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real app, this would redirect to OAuth or API key setup
    alert(`Successfully connected to ${availableIntegrations.find(i => i.id === integrationId)?.name}!`)
    setConnectingIntegration(null)
  }

  const getConnectedIntegration = (integrationId: string) => {
    return connectedIntegrations.find(c => c.integrationId === integrationId)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      connected: "bg-green-100 text-green-800",
      available: "bg-secondary/10 text-secondary",
      coming_soon: "bg-yellow-100 text-yellow-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
              🔗 API Integrations Hub
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with your favorite tools and automate your workflow
            </p>
          </div>

          {/* Connected Integrations Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Connected Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectedIntegrations.map((connection) => {
                const integration = availableIntegrations.find(i => i.id === connection.integrationId)
                if (!integration) return null

                return (
                  <div key={connection.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{integration.name}</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Connected
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last sync: {new Date(connection.lastSync).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Filter by Category
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

              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">API Status: <span className="text-green-600">● Online</span></p>
                  <p>Last updated: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const isConnected = getConnectedIntegration(integration.id)
              const isConnecting = connectingIntegration === integration.id

              return (
                <div
                  key={integration.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{integration.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(integration.status)}`}>
                          {integration.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {isConnected && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {integration.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                    <ul className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <span className="text-sm font-medium text-foreground">
                      Pricing: <span className="text-primary">{integration.pricing}</span>
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-3">
                    {isConnected ? (
                      <>
                        <button className="flex-1 btn-outline text-sm">
                          Configure
                        </button>
                        <button className="btn-outline text-red-600 hover:bg-red-50 text-sm px-4">
                          Disconnect
                        </button>
                      </>
                    ) : integration.status === "coming_soon" ? (
                      <button className="flex-1 btn-outline text-sm" disabled>
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        disabled={isConnecting}
                        className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConnecting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Connecting...
                          </div>
                        ) : (
                          "Connect"
                        )}
                      </button>
                    )}
                  </div>

                  {/* Setup Steps */}
                  {!isConnected && integration.status === "available" && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <h5 className="text-sm font-semibold text-foreground mb-2">Setup Steps:</h5>
                      <ol className="text-xs text-muted-foreground space-y-1">
                        {integration.setupSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-4 h-4 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Integration Benefits */}
          <div className="mt-12 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl border border-primary/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">🚀 Why Integrate?</h2>
              <p className="text-muted-foreground">Maximize productivity with seamless tool connections</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Automate Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Eliminate manual data entry and repetitive tasks with smart automation
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Real-time Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all your tools in sync with instant data synchronization
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Unified Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive insights across all connected platforms
                </p>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">🔧 Developer Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">REST API</h3>
                <p className="text-muted-foreground mb-4">
                  Build custom integrations with our comprehensive REST API
                </p>
                <div className="space-y-2">
                  <button className="btn-outline text-sm w-full">View API Documentation</button>
                  <button className="btn-outline text-sm w-full">Generate API Key</button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Webhooks</h3>
                <p className="text-muted-foreground mb-4">
                  Receive real-time notifications for system events
                </p>
                <div className="space-y-2">
                  <button className="btn-outline text-sm w-full">Configure Webhooks</button>
                  <button className="btn-outline text-sm w-full">View Event Logs</button>
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