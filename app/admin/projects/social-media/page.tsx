import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects, getUsers } from "@/lib/mock-data"
import { getFirestoreProjects, getFirestoreUsers, deleteFirestoreProject } from "@/lib/firestore-service"
import type { Project, SocialMediaPlatform, User } from "@/types"
import StatusBadge from "@/components/status-badge"
import { getStageDisplayName, formatRelativeTime } from "@/lib/utils"
import { Edit, Trash2, Search } from "lucide-react"

// Check if using Firebase (not mock auth)
const useFirebase = () => localStorage.getItem('useMockAuth') === 'false'

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
  const [platformFilter, setPlatformFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (useFirebase()) {
          const [firestoreProjects, firestoreUsers] = await Promise.all([
            getFirestoreProjects(),
            getFirestoreUsers()
          ])
          setProjects(firestoreProjects.filter(p => p.projectType === "social_media"))
          setUsers(firestoreUsers)
        } else {
          setProjects(getProjects().filter(p => p.projectType === "social_media"))
          setUsers(getUsers())
        }
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to localStorage
        setProjects(getProjects().filter(p => p.projectType === "social_media"))
        setUsers(getUsers())
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.role === "admin") {
      loadData()
    }
  }, [user])

  // Get unique platforms, products, and months for filters
  const availablePlatforms = useMemo(() => {
    const platforms = new Set<string>()
    projects.forEach(project => {
      if (project.socialMediaPlatforms) {
        // Ensure no duplicates within each project's platforms array
        const uniqueProjectPlatforms = [...new Set(project.socialMediaPlatforms)]
        uniqueProjectPlatforms.forEach(platform => platforms.add(platform))
      }
    })
    return Array.from(platforms).sort()
  }, [projects])

  const availableProducts = useMemo(() => {
    const products = new Set<string>()
    projects.forEach(project => {
      if (project.product) {
        products.add(project.product)
      }
    })
    return Array.from(products).sort()
  }, [projects])



  // Filter projects based on search term, platform, product, and date range
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPlatform = !platformFilter ||
        (project.socialMediaPlatforms && project.socialMediaPlatforms.includes(platformFilter as SocialMediaPlatform))

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

      return matchesSearch && matchesPlatform && matchesProduct && matchesDateRange
    })
  }, [projects, searchTerm, platformFilter, productFilter, dateFrom, dateTo])

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

  if (!user || user.role !== "admin" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        if (useFirebase()) {
          await deleteFirestoreProject(projectId)
          setProjects(prev => prev.filter(p => p.id !== projectId))
        } else {
          const allProjects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
          const updatedProjects = allProjects.filter((p: Project) => p.id !== projectId)
          localStorage.setItem("marketing_management_website_projects", JSON.stringify(updatedProjects))
          setProjects(prev => prev.filter(p => p.id !== projectId))
        }
      } catch (error) {
        console.error("Error deleting project:", error)
        alert("Failed to delete project. Please try again.")
      }
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
                  <svg className="w-10 h-10 text-[#FFA600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  📱 Social Media Brands Management
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Manage all social media brands organized by month. Total: {filteredProjects.length} brands
                </p>
              </div>
               <div className="flex gap-3 lg:flex-shrink-0">
                 <Link to="/admin/projects/new" className="bg-[#92ABC4] hover:bg-[#FFA600] text-[#12265E] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                   </svg>
                   Add New Brand
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

           {/* Search and Filters */}
           <div className="bg-[#92ABC4]/20 dark:bg-gray-800 rounded-xl border border-[#12265E]/20 p-6 mb-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">Search:</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[300px]"
                    placeholder="Search brands..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">Platform:</span>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
                  >
                    <option value="">All Platforms</option>
                    {availablePlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                 <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground font-medium">Product:</span>
                   <select
                     value={productFilter}
                     onChange={(e) => setProductFilter(e.target.value)}
                     className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
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

                 {(platformFilter || productFilter || searchTerm || dateFrom || dateTo) && (
                   <button
                     onClick={() => {
                       setSearchTerm("")
                       setPlatformFilter("")
                       setProductFilter("")
                       setDateFrom("")
                       setDateTo("")
                     }}
                     className="text-sm text-[#FFA600] hover:text-[#12265E] font-medium underline"
                   >
                     Clear Filters
                   </button>
                 )}
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} brands
              </div>
            </div>
          </div>

          {/* Monthly Social Media Brands */}
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
              <div key={monthYear} className="bg-gradient-to-r from-[#92ABC4]/10 to-[#FFA600]/10 rounded-xl p-8 border border-[#12265E]/20">
                <h2 className="text-2xl font-bold text-[#12265E] mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-[#FFA600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {monthYear} - {monthProjects.length} Brand{monthProjects.length !== 1 ? 's' : ''}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-[#12265E]/30 bg-[#92ABC4]/10">
                    <thead>
                      <tr className="bg-[#92ABC4]/20">
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">#</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Date</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Brand</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Client</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Product</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Platform</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Posts</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Likes</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Impressions</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Reach</th>
                        <th className="px-4 py-3 text-left font-semibold border-r border-[#12265E]/20 text-[#12265E]">Engagement</th>
                        <th className="px-4 py-3 text-left font-semibold text-[#12265E]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthProjects.map((project, index) => {
                        const client = users.find(u => u.id === project.clientId)

                        return (
                          <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-[#92ABC4]/5"}>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-sm font-medium text-[#12265E]">{index + 1}</td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20">
                              <div className="text-sm text-[#12265E] font-medium">
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
                            <td className="px-4 py-3 border-r border-[#12265E]/20">
                              <div className="font-medium text-[#12265E]">{project.name}</div>
                              <div className="text-xs text-[#12265E]/70">{project.description}</div>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20">
                              <div className="text-sm">
                                {client ? (
                                  <>
                                    <div className="font-medium text-[#12265E]">{client.fullName}</div>
                                    <div className="text-xs text-[#12265E]/60">{client.email}</div>
                                  </>
                                ) : (
                                  <span className="text-xs text-[#12265E] italic">Not assigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20">
                              {project.product ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#FFA600]/20 text-[#12265E]">
                                  {project.product}
                                </span>
                              ) : (
                                <span className="text-xs text-[#12265E] italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20">
                              {project.socialMediaPlatforms && project.socialMediaPlatforms.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {project.socialMediaPlatforms.map(platform => (
                                    <span key={platform} className="inline-block px-2 py-1 text-xs bg-[#92ABC4]/30 text-[#12265E] rounded capitalize font-medium">
                                      {platform}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-[#12265E] italic">Not set</span>
                              )}
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-center">
                              <span className="text-sm font-semibold text-[#12265E]">
                                {project.posts?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-center">
                              <span className="text-sm font-semibold text-[#12265E]">
                                {project.likes?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-center">
                              <span className="text-sm font-semibold text-[#12265E]">
                                {project.impressions?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-center">
                              <span className="text-sm font-semibold text-[#12265E]">
                                {project.reach?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-r border-[#12265E]/20 text-center">
                              <span className="text-sm font-semibold text-[#12265E]">
                                {project.engagement?.toLocaleString() || '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/admin/projects/${project.id}/edit`}
                                  className="bg-[#92ABC4]/30 hover:bg-[#FFA600] text-[#12265E] px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
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
              <div className="bg-[#92ABC4]/10 dark:bg-gray-800 rounded-xl border border-[#12265E]/20 p-12 text-center shadow-sm">
                <svg className="w-16 h-16 text-[#12265E]/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-xl font-semibold text-[#12265E] mb-2">No Social Media Brands Found</h3>
                <p className="text-[#12265E]/70 mb-6">There are no social media brands in the system yet.</p>
                <Link to="/admin/projects/new" className="bg-[#92ABC4]/30 hover:bg-[#FFA600] text-[#12265E] px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Brand
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