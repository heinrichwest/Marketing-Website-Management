import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects, getUsers } from "@/lib/mock-data"
import type { Project } from "@/types"
import StatusBadge from "@/components/status-badge"
import { getStageDisplayName, formatRelativeTime } from "@/lib/utils"
import { Edit, Trash2, Search } from "lucide-react"

export default function SocialMediaProjectsPage() {
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

    if (user.role !== "admin") {
      navigate("/dashboard")
      return
    }
  }, [isSignedIn, user, navigate])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [projects] = useState(getProjects().filter(p => p.projectType === "social_media"))
  const [users] = useState(getUsers())

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])

  // Group projects by month (show all months from November onwards)
  const projectsByMonth = useMemo(() => {
    const grouped: Record<string, Project[]> = {}

    // Initialize months from November 2024 to current month
    const startDate = new Date(2024, 10, 1) // November 2024
    const currentDate = new Date()
    const months = []

    let currentMonth = new Date(startDate)
    while (currentMonth <= currentDate) {
      const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      months.push(monthYear)
      grouped[monthYear] = []
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    // Add projects to their respective months
    filteredProjects.forEach(project => {
      const projectDate = new Date(project.createdAt)
      const monthYear = projectDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

      if (grouped[monthYear]) {
        grouped[monthYear].push(project)
      }
    })

    return grouped
  }, [filteredProjects])

  const pageSize = 50 // Show all projects
  const totalPages = 1

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const projects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
      const updatedProjects = projects.filter((p: Project) => p.id !== projectId)
      localStorage.setItem("marketing_management_website_projects", JSON.stringify(updatedProjects))
      window.location.reload()
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  📱 Social Media Projects Management
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Manage all social media campaign projects organized by month. Total: {filteredProjects.length} projects
                </p>
              </div>
              <div className="flex gap-3 lg:flex-shrink-0">
                <Link to="/admin/projects/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Social Media Project
                </Link>
                <Link to="/admin/dashboard" className="btn-outline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[300px]"
                  placeholder="Search social media projects..."
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} social media projects
              </div>
            </div>
          </div>

          {/* Monthly Social Media Projects */}
          <div className="space-y-8">
            {Object.entries(projectsByMonth).map(([monthYear, monthProjects]) => (
              <div key={monthYear} className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {monthYear} - {monthProjects.length} Project{monthProjects.length !== 1 ? 's' : ''}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-purple-200 bg-white">
                    <thead>
                      <tr className="bg-purple-100">
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">#</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Date</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Project Name</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Client</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Product</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Platform</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Posts</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Likes</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Impressions</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Reach</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Engagement</th>
                        <th className="px-4 py-3 text-left font-semibold text-purple-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthProjects.map((project, index) => {
                        const client = users.find(u => u.id === project.clientId)

                        return (
                          <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-purple-50/50"}>
                            <td className="px-4 py-3 border-r border-purple-200 text-sm font-medium text-purple-900">{index + 1}</td>
                            <td className="px-4 py-3 border-r border-purple-200">
                              <div className="text-sm text-purple-900 font-medium">
                                {project.projectDate
                                  ? new Date(project.projectDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : new Date(project.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                }
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200">
                              <div className="font-medium text-purple-900">{project.name}</div>
                              <div className="text-xs text-purple-700">{project.description}</div>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200">
                              <div className="text-sm">
                                {client ? (
                                  <>
                                    <div className="font-medium text-purple-900">{client.fullName}</div>
                                    <div className="text-xs text-purple-600">{client.email}</div>
                                  </>
                                ) : (
                                  <span className="text-xs text-purple-500 italic">Not assigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200">
                              {project.product ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  {project.product}
                                </span>
                              ) : (
                                <span className="text-xs text-purple-500 italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200">
                              {project.socialMediaPlatforms && project.socialMediaPlatforms.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {project.socialMediaPlatforms.map(platform => (
                                    <span key={platform} className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded capitalize font-medium">
                                      {platform}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-purple-500 italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200 text-center">
                              <span className="text-sm font-semibold text-purple-900">
                                {project.posts?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200 text-center">
                              <span className="text-sm font-semibold text-purple-900">
                                {project.likes?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200 text-center">
                              <span className="text-sm font-semibold text-purple-900">
                                {project.impressions?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200 text-center">
                              <span className="text-sm font-semibold text-purple-900">
                                {project.reach?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-purple-200 text-center">
                              <span className="text-sm font-semibold text-purple-900">
                                {project.engagement?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/admin/projects/${project.id}/edit`}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {Object.keys(projectsByMonth).length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-12 text-center shadow-sm">
                <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Social Media Projects Found</h3>
                <p className="text-muted-foreground mb-6">There are no social media projects in the system yet.</p>
                <Link to="/admin/projects/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Social Media Project
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}