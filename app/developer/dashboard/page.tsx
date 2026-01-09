import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getTicketsByUserId } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { getStageDisplayName, formatRelativeTime, getTicketTypeDisplayName } from "@/lib/utils"

export default function DeveloperDashboard() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user) {
      return
    }

    // Strict role checking - redirect unauthorized users
    if (user.role !== "web_developer") {
      // Redirect to appropriate dashboard or home based on role
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard")
          break
        case "social_media_coordinator":
          navigate("/coordinator/dashboard")
          break
        case "client":
          navigate("/client-portal/dashboard")
          break
        default:
          navigate("/")
      }
      return
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "web_developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const myProjects = getProjectsByUserId(user.id, user.role)
  const myTickets = getTicketsByUserId(user.id, user.role)

  const stats = {
    assignedProjects: myProjects.length,
    openTickets: myTickets.filter((t) => t.status === "open").length,
    inProgressTickets: myTickets.filter((t) => t.status === "in_progress").length,
    resolvedTickets: myTickets.filter((t) => t.status === "resolved").length,
  }

  const recentProjects = myProjects.slice(0, 3)
  const recentTickets = myTickets.slice(0, 5)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Developer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}! Here&apos;s your project overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Assigned Projects"
              value={stats.assignedProjects}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Open Tickets"
              value={stats.openTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
             <div className="flex gap-4 flex-wrap">
               <Link to="/developer/tickets" className="btn-primary">
                 View Tickets
               </Link>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Projects</h2>
                <Link to="/developer/projects" className="text-primary hover:underline text-sm">

                </Link>
              </div>

              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-primary text-xs font-medium">
                          {getStageDisplayName(project.currentStage)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Updated {formatRelativeTime(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects assigned yet.</p>
                </div>
              )}
            </div>

            {/* My Tickets */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Tickets</h2>
                <Link to="/developer/tickets" className="text-primary hover:underline text-sm">

                </Link>
              </div>

              {recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground">{getTicketTypeDisplayName(ticket.type)}</p>
                        </div>
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <StatusBadge status={ticket.status} />
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tickets assigned yet.</p>
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
