import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getProjects, getUsers, getTickets } from "../../../lib/mock-data"
import StatusBadge from "../../../components/status-badge"
import { getStageDisplayName, formatRelativeTime } from "../../../lib/utils"
import type { Project } from "../../../types"
import { Edit, Trash2 } from "lucide-react"

export default function AdminProjectsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
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

  const allProjects = getProjects()
  const users = getUsers()
  const tickets = getTickets()

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allProjects, searchTerm])

  // Paginate projects
  const totalPages = Math.ceil(filteredProjects.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Calculate ticket count per project
  const getProjectTicketCount = (projectId: string) => {
    return tickets.filter((t) => t.projectId === projectId).length
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      // Remove from localStorage
      const projects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
      const updatedProjects = projects.filter((p: any) => p.id !== projectId)
      localStorage.setItem("marketing_management_website_projects", JSON.stringify(updatedProjects))

      // Refresh the page to update the list
      window.location.reload()
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Manage Projects</h1>
                <p className="text-muted-foreground">View and manage all projects in the system.</p>
              </div>
              <div className="flex gap-4">
                <Link to="/admin/dashboard" className="btn-outline hover:border-accent hover:text-accent">
                  ← Back to Dashboard
                </Link>
                <Link to="/admin/projects/new" className="btn-primary hover:shadow-accent/20">
                  + New Project
                </Link>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Projects ({filteredProjects.length})</h2>
            </div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-border rounded px-2 py-1 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
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
                  placeholder="Search projects..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-primary text-primary-foreground">
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">#</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Project Name</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Status</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Current Stage</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Client</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Developer</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Tickets</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Analytics</th>
                     <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((project: Project, index: number) => {
                    const client = users.find((u) => u.id === project.clientId)
                    const developer = users.find((u) => u.id === project.webDeveloperId)
                    const coordinator = users.find((u) => u.id === project.socialMediaCoordinatorId)
                    const ticketCount = getProjectTicketCount(project.id)

                    return (
                      <tr
                        key={project.id}
                        className={`${
                          index % 2 === 0 ? "bg-background" : "bg-muted/30"
                        } hover:bg-secondary/10 transition border-b border-border`}
                      >
                        <td className="px-4 py-3 text-sm">{startIndex + index + 1}</td>
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
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                            {getStageDisplayName(project.currentStage)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {client ? (
                              <>
                                <div className="font-medium text-foreground">{client.fullName}</div>
                                <div className="text-xs text-muted-foreground">{client.email}</div>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not assigned</span>
                            )}
                          </div>
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
                             <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {ticketCount}
                            </span>
                             <Link
                               to={`/admin/tickets?project=${project.id}`}
                               className="text-xs text-primary hover:underline"
                             >
                               View
                             </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/admin/analytics/${project.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/80 transition"
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
                               to={`/admin/projects/${project.id}/edit`}
                               className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                               aria-label="Edit project"
                             >
                               <Edit className="w-4 h-4" />
                             </Link>
                             <button
                               onClick={() => handleDeleteProject(project.id)}
                               className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                               aria-label="Delete project"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
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
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
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