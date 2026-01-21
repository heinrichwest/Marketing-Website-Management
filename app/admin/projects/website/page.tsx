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

export default function WebsiteProjectsPage() {
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
  const [productFilter, setProductFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [projects] = useState(getProjects().filter(p => p.projectType === "website"))
  const [users] = useState(getUsers())

  // Filter projects based on search term and date range
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProduct = !productFilter || project.product === productFilter

      const matchesDateRange = (() => {
        // Use projectDate if available, otherwise fall back to createdAt
        const dateToUse = project.projectDate || project.createdAt
        const projectDate = new Date(dateToUse)

        if (dateFrom && dateTo) {
          const fromDate = new Date(dateFrom)
          const toDate = new Date(dateTo)
          return projectDate >= fromDate && projectDate <= toDate
        } else if (dateFrom) {
          const fromDate = new Date(dateFrom)
          return projectDate >= fromDate
        } else if (dateTo) {
          const toDate = new Date(dateTo)
          return projectDate <= toDate
        }

        return true // No date filter applied
      })()

      return matchesSearch && matchesProduct && matchesDateRange
    })
  }, [projects, searchTerm, productFilter, dateFrom, dateTo])

  const availableProducts = useMemo(() => {
    const products = new Set<string>()
    projects.forEach(project => {
      if (project.product) {
        products.add(project.product)
      }
    })
    return Array.from(products).sort()
  }, [projects])

  // Group projects by month (show all months from November 2024 onwards)
  const projectsByMonth = useMemo(() => {
    const grouped: Record<string, Project[]> = {}

    // Initialize months from November 2024 to current month
    const startDate = new Date(2024, 10, 1) // November 2024
    const endDate = new Date() // Current date
    const months = []

    let currentMonth = new Date(startDate)
    while (currentMonth <= endDate) {
      const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      months.push(monthYear)
      grouped[monthYear] = []
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    // Add projects to their respective months
    filteredProjects.forEach(project => {
      // Use projectDate if available, otherwise fall back to createdAt
      const dateToUse = project.projectDate || project.createdAt
      const projectDate = new Date(dateToUse)
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
                   🌐 Website Projects Management
                 </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Manage all website development projects organized by month. Total: {filteredProjects.length} projects
                </p>
              </div>
              <div className="flex gap-3 lg:flex-shrink-0">
                 <Link to="/admin/projects/new" className="bg-[#12265E] hover:bg-[#0f1e4a] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Website Project
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
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 flex-wrap">
                 <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground">Search:</span>
                   <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[300px]"
                     placeholder="Search website projects..."
                   />
                 </div>

                 <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground font-medium">Product:</span>
                   <select
                     value={productFilter}
                     onChange={(e) => setProductFilter(e.target.value)}
                     className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]"
                   >
                     <option value="">All Products</option>
                     {availableProducts.map(product => (
                       <option key={product} value={product}>{product}</option>
                     ))}
                   </select>
                 </div>

                 <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground font-medium">Date Range:</span>
                   <input
                     type="date"
                     value={dateFrom}
                     onChange={(e) => setDateFrom(e.target.value)}
                     className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                     placeholder="From"
                   />
                   <span className="text-sm text-muted-foreground">to</span>
                   <input
                     type="date"
                     value={dateTo}
                     onChange={(e) => setDateTo(e.target.value)}
                     className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                     placeholder="To"
                   />
                 </div>

                  {(searchTerm || productFilter || dateFrom || dateTo) && (
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setProductFilter("")
                        setDateFrom("")
                        setDateTo("")
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Clear Filters
                    </button>
                  )}
               </div>

               <div className="text-sm text-muted-foreground">
                 Showing {filteredProjects.length} of {projects.length} website projects
               </div>
             </div>
           </div>

          {/* Monthly Website Projects */}
          <div className="space-y-8">
            {Object.entries(projectsByMonth)
              .filter(([monthYear, monthProjects]) => monthProjects.length > 0) // Only show months with projects
              .sort(([a], [b]) => {
                // Parse month-year strings like "January 2026" to dates for sorting (latest first)
                const [monthA, yearA] = a.split(' ')
                const [monthB, yearB] = b.split(' ')
                const dateA = new Date(parseInt(yearA), new Date(`${monthA} 1, ${yearA}`).getMonth(), 1)
                const dateB = new Date(parseInt(yearB), new Date(`${monthB} 1, ${yearB}`).getMonth(), 1)
                return dateB.getTime() - dateA.getTime()
              })
              .map(([monthYear, monthProjects]) => (
              <div key={monthYear} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {monthYear} - {monthProjects.length} Project{monthProjects.length !== 1 ? 's' : ''}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-blue-200 bg-white">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">#</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Date</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Project Name</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Client</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Product</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Status</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Stage</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Developer</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Website URL</th>
                        <th className="px-4 py-3 text-left font-semibold text-blue-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthProjects.map((project, index) => {
                        const client = users.find(u => u.id === project.clientId)
                        const developer = users.find(u => u.id === project.webDeveloperId)

                        return (
                          <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/50"}>
                            <td className="px-4 py-3 border-r border-blue-200 text-sm font-medium text-blue-900">{index + 1}</td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              <div className="text-sm text-blue-900 font-medium">
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
                            <td className="px-4 py-3 border-r border-blue-200">
                              <div className="font-medium text-blue-900">{project.name}</div>
                              <div className="text-xs text-blue-700">{project.description}</div>
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              <div className="text-sm">
                                {client ? (
                                  <>
                                    <div className="font-medium text-blue-900">{client.fullName}</div>
                                    <div className="text-xs text-blue-600">{client.email}</div>
                                  </>
                                ) : (
                                  <span className="text-xs text-blue-500 italic">Not assigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              {project.product ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {project.product}
                                </span>
                              ) : (
                                <span className="text-xs text-blue-500 italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              <StatusBadge status={project.status} />
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {getStageDisplayName(project.currentStage)}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              <div className="text-sm">
                                {developer ? (
                                  <>
                                    <div className="font-medium text-blue-900">{developer.fullName}</div>
                                    <div className="text-xs text-blue-600">{developer.email}</div>
                                  </>
                                ) : (
                                  <span className="text-xs text-blue-500 italic">Not assigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-blue-200">
                              {project.websiteUrl ? (
                                <a
                                  href={project.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                                >
                                  {project.websiteUrl}
                                </a>
                              ) : (
                                <span className="text-xs text-blue-500 italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/admin/projects/${project.id}/analytics`}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  Analytics
                                </Link>
                                <Link
                                  to={`/admin/projects/${project.id}/edit`}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Website Projects Found</h3>
                <p className="text-muted-foreground mb-6">There are no website projects in the system yet.</p>
                <Link to="/admin/projects/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Website Project
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