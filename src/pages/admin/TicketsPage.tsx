import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getTickets, getProjects, getUsers } from "../../../lib/mock-data"
import StatusBadge from "../../../components/status-badge"
import PriorityBadge from "../../../components/priority-badge"
import { formatRelativeTime } from "../../../lib/utils"

export default function AdminTicketsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

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

  const allTickets = getTickets()
  const projects = getProjects()
  const allUsers = getUsers()

  // Filter by project if query param exists
  const projectId = searchParams.get("project")
  let filteredTickets = allTickets
  if (projectId) {
    filteredTickets = allTickets.filter(ticket => ticket.projectId === projectId)
  }

  // Filter by search term
  filteredTickets = filteredTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginate tickets
  const totalPages = Math.ceil(filteredTickets.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {projectId ? `Tickets for ${projects.find(p => p.id === projectId)?.name || 'Project'}` : 'All Tickets'}
                </h1>
                <p className="text-muted-foreground">
                  {projectId ? 'View all tickets for this project' : 'View and manage all tickets in the system'}
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/admin/dashboard" className="btn-outline">
                  ← Back to Dashboard
                </Link>
                {projectId && (
                  <Link to={`/admin/projects/${projectId}`} className="btn-outline">
                    View Project
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Tickets ({filteredTickets.length})
              </h2>
            </div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-border rounded px-2 py-1 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-border rounded px-3 py-1 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
                  placeholder="Search tickets..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-primary text-primary-foreground">
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">#</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Title</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Project</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Priority</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Status</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Type</th>
                     <th className="px-4 py-3 text-left font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket, index) => {
                    const project = projects.find((p) => p.id === ticket.projectId)
                    return (
                      <tr
                        key={ticket.id}
                        className={`${
                          index % 2 === 0 ? "bg-background" : "bg-muted/30"
                        } hover:bg-secondary/10 transition border-b border-border`}
                      >
                        <td className="px-4 py-3 text-sm">{startIndex + index + 1}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-semibold text-foreground">{ticket.title}</div>
                            <div className="text-xs text-muted-foreground">{ticket.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {project ? (
                              <div className="font-medium text-foreground">{project.name}</div>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Unknown Project</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {ticket.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {formatRelativeTime(ticket.createdAt)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (pageNum > totalPages) return null
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm border rounded ${
                            pageNum === currentPage
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}