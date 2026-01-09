import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets } from "@/lib/mock-data"
import type { Project, Ticket } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format } from "date-fns"

export default function ClientAnalyticsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data asynchronously to prevent blocking
  const loadData = useCallback(async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate async loading (in real app, this would be API calls)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Load only the data we need
    const allProjects = getProjects()
    const allTickets = getTickets()

    // Filter data efficiently
    const clientProjects = allProjects.filter((p: Project) => p.clientId === user.id)
    const projectTickets = allTickets.filter((t: Ticket) =>
      clientProjects.some((p: Project) => p.id === t.projectId)
    )

    setProjects(clientProjects)
    setTickets(projectTickets)
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user || user.role !== "client") {
      navigate("/dashboard")
      return
    }

    loadData()
  }, [user, isSignedIn, navigate, loadData])

  // Memoize expensive calculations
  const activeProjects = useMemo(() =>
    projects.filter((p: Project) => p.status === "active"), [projects]
  )

  const completedProjects = useMemo(() =>
    projects.filter((p: Project) => p.status === "completed"), [projects]
  )

  const openTickets = useMemo(() =>
    tickets.filter((t: Ticket) => t.status === "open" || t.status === "in_progress"), [tickets]
  )

  const resolvedTickets = useMemo(() =>
    tickets.filter((t: Ticket) => t.status === "resolved"), [tickets]
  )

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
                className="btn-outline text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Project Analytics</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Track the progress of your website development projects and manage support tickets
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
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
                  <p className="text-2xl font-bold text-foreground">{activeProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Completed Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{tickets.length}</p>
                  <p className="text-sm text-muted-foreground">Support Tickets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects and Tickets Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">My Projects</h3>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Current Stage: <span className="capitalize">{project.currentStage}</span>
                        </span>
                        <a
                          href={`/analytics/${project.id}`}
                          className="text-primary hover:underline"
                        >
                          View Progress
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No projects assigned yet.</p>
              )}
            </div>

            {/* Support Tickets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Support Tickets</h3>
                <a href="/client/tickets/new" className="btn-primary text-sm">
                  New Ticket
                </a>
              </div>
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.slice(0, 5).map((ticket) => {
                    const project = projects.find(p => p.id === ticket.projectId)
                    return (
                      <div key={ticket.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{ticket.title}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {project?.name} • {format(ticket.createdAt, "MMM dd, yyyy")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {tickets.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{tickets.length - 5} more tickets
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No support tickets yet.</p>
                  <a href="/client/tickets/new" className="btn-primary">
                    Create First Ticket
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}