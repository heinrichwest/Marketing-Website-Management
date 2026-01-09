import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets } from "@/lib/mock-data"
import type { Project, Ticket } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format } from "date-fns"

export default function DeveloperAnalyticsPage() {
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
    const assignedProjects = allProjects.filter((p: Project) => p.webDeveloperId === user.id)
    const assignedTickets = allTickets.filter((t: Ticket) => t.assignedTo === user.id)

    setProjects(assignedProjects)
    setTickets(assignedTickets)
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user || user.role !== "web_developer") {
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
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Development Analytics</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Track your development progress, project assignments, and ticket resolution metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{tickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{resolvedTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Resolved Tickets</p>
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
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{project.status}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                  {projects.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{projects.length - 5} more projects
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No projects assigned yet.</p>
              )}
            </div>

            {/* Recent Tickets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Tickets</h3>
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(ticket.createdAt, "MMM dd, yyyy")}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  ))}
                  {tickets.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{tickets.length - 5} more tickets
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No tickets assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}