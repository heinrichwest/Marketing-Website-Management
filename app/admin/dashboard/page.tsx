import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { getStageDisplayName, formatRelativeTime } from "@/lib/utils"

export default function AdminDashboard() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const projects = getProjects()
  const tickets = getTickets()
  const users = getUsers()

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalUsers: users.length,
    openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
  }

  const recentProjects = projects.slice(0, 5)
  const recentTickets = tickets.slice(0, 5)

  // Calculate ticket count per project
  const getProjectTicketCount = (projectId: string) => {
    return tickets.filter((t) => t.projectId === projectId).length
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}! Here's your system overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
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
              title="Active Projects"
              value={stats.activeProjects}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              }
            />
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Link to="/admin/projects/new" className="btn-primary">
                + New Project
              </Link>
              <Link to="/admin/projects" className="btn-outline">
                Manage Projects
              </Link>
              <Link to="/admin/users" className="btn-outline">
                Manage Users
              </Link>
            </div>
          </div>

          {/* All Projects Table */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Projects</h2>
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">
                  Show{" "}
                  <select className="border border-border rounded px-2 py-1 bg-background text-foreground">
                    <option>10</option>
                    <option>25</option>
                    <option selected>50</option>
                    <option>100</option>
                  </select>{" "}
                  entries
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Search:</span>
                  <input
                    type="text"
                    className="border border-border rounded px-3 py-1 bg-background text-foreground"
                    placeholder="Search projects..."
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1e2875] text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">#</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Project Name</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Status</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Current Stage</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Developer</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">My Tickets</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Analytics</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => {
                    const developer = users.find((u) => u.id === project.webDeveloperId)
                    const coordinator = users.find((u) => u.id === project.socialMediaCoordinatorId)
                    const ticketCount = getProjectTicketCount(project.id)

                    return (
                      <tr
                        key={project.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition border-b border-gray-200`}
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-semibold text-foreground">{project.name}</div>
                            <div className="text-xs text-muted-foreground">{project.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {getStageDisplayName(project.currentStage)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {developer ? (
                              <>
                                <div className="font-medium text-foreground">{developer.fullName}</div>
                                <div className="text-xs text-muted-foreground">{developer.email}</div>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                              {ticketCount}
                            </span>
                            <Link
                              to={`/tickets?project=${project.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/analytics/${project.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1e2875] text-white rounded text-xs font-medium hover:bg-[#2a3488] transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Analytics
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              View
                            </Link>
                            <Link
                              to={`/admin/projects/${project.id}/edit`}
                              className="text-xs text-primary hover:underline"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
                <Link to="/admin/projects" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const client = users.find((u) => u.id === project.clientId)
                  return (
                    <div
                      key={project.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{client?.fullName}</p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Stage: <span className="text-foreground">{getStageDisplayName(project.currentStage)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          {formatRelativeTime(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Tickets</h2>
                <Link to="/tickets" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentTickets.map((ticket) => {
                  const project = projects.find((p) => p.id === ticket.projectId)
                  return (
                    <div
                      key={ticket.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground">{project?.name}</p>
                        </div>
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={ticket.status} />
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(ticket.createdAt)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
