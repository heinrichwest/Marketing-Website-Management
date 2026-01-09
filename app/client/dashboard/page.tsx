import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getTicketsByUserId, getUsers } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import UserAvatar from "@/components/user-avatar"
import { getStageDisplayName, getStageProgress, formatRelativeTime } from "@/lib/utils"

export default function ClientDashboard() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "client") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const myProjects = getProjectsByUserId(user.id, user.role)
  const myTickets = getTicketsByUserId(user.id, user.role)
  const allUsers = getUsers()

  const stats = {
    myProjects: myProjects.length,
    activeTickets: myTickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
    resolvedTickets: myTickets.filter((t) => t.status === "resolved").length,
    inProgressProjects: myProjects.filter((p) => p.status === "active").length,
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Client Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}! Here&apos;s your project status.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="My Projects"
              value={stats.myProjects}
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
              title="In Progress"
              value={stats.inProgressProjects}
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
              title="Active Tickets"
              value={stats.activeTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
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
              <Link to="/client/tickets/new" className="btn-primary">
                + Create New Ticket
              </Link>
              <Link to="/client/projects" className="btn-outline">
                View All Projects
              </Link>
              <Link to="/client/tickets" className="btn-outline">
                View All Tickets
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Projects</h2>
                <Link to="/client/projects" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>

              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => {
                    const developer = allUsers.find((u) => u.id === project.webDeveloperId)
                    const coordinator = allUsers.find((u) => u.id === project.socialMediaCoordinatorId)
                    const progress = getStageProgress(project.currentStage)

                    return (
                      <div
                        key={project.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                          </div>
                          <StatusBadge status={project.status} />
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Stage and Team */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                            {getStageDisplayName(project.currentStage)}
                          </span>
                          <div className="flex items-center gap-1">
                            {developer && <UserAvatar fullName={developer.fullName} size="sm" />}
                            {coordinator && <UserAvatar fullName={coordinator.fullName} size="sm" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects yet.</p>
                </div>
              )}
            </div>

            {/* My Tickets */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Tickets</h2>
                <Link to="/client/tickets/new" className="text-primary hover:underline text-sm">
                  + Create Ticket
                </Link>
              </div>

              {recentTickets.length > 0 ? (
                <div className="space-y-4">
                  {recentTickets.map((ticket) => {
                    const assignedDev = allUsers.find((u) => u.id === ticket.assignedTo)
                    return (
                      <div
                        key={ticket.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                            {assignedDev && (
                              <p className="text-sm text-muted-foreground">
                                Assigned to {assignedDev.fullName}
                              </p>
                            )}
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
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tickets yet.</p>
                  <Link to="/client/tickets/new" className="text-primary hover:underline text-sm mt-2 inline-block">
                    Create your first ticket
                  </Link>
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
