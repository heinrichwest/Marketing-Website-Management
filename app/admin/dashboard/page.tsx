"use client"

import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { StatCardSkeleton, ProjectCardSkeleton } from "@/components/skeleton"
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

  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Simulate network delay
    return () => clearTimeout(timer)
  }, [])

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

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])

  // Paginate projects
  const totalPages = Math.ceil(filteredProjects.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Reset to first page when pageSize changes if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [pageSize, totalPages, currentPage])

  // Calculate ticket count per project
  const getProjectTicketCount = (projectId: string) => {
    return tickets.filter((t) => t.projectId === projectId).length
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Administrator Dashboard</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">Welcome back, Administrator {user.fullName}! Here's your complete system overview and management controls.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Projects"
                  value={stats.totalProjects}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  }
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <Link to="/admin/projects/new" className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </Link>
              <Link to="/admin/projects" className="btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Manage Projects
              </Link>
              <Link to="/admin/users" className="btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Users
              </Link>
              <Link to="/analytics" className="btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </Link>
            </div>
          </div>

          {/* All Projects Table */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Projects ({filteredProjects.length})</h2>
              <div className="flex items-center gap-4">
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
                     placeholder="Search projects..."
                   />
                 </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table key={`${pageSize}-${currentPage}`} className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1e2875] text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">#</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Project Name</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Status</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Current Stage</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Client</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Developer</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Tickets</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Analytics</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                 <tbody>
                   {paginatedProjects.map((project, index) => {
                     const client = users.find((u) => u.id === project.clientId)
                     const developer = users.find((u) => u.id === project.webDeveloperId)
                     const coordinator = users.find((u) => u.id === project.socialMediaCoordinatorId)
                     const ticketCount = getProjectTicketCount(project.id)

                     return (
                       <tr
                         key={project.id}
                         className={`${
                           index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                            to={`/analytics/${project.id}`}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Recent Projects</h2>
                <Link to="/admin/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                  </>
                ) : (
                  recentProjects.map((project) => {
                    const client = users.find((u) => u.id === project.clientId)
                    return (
                      <div
                        key={project.id}
                        className="p-6 border border-border/50 rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{client?.fullName}</p>
                          </div>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Stage: <span className="text-foreground font-medium">{getStageDisplayName(project.currentStage)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {formatRelativeTime(project.updatedAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Recent Tickets</h2>
                <Link to="/tickets" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                    <ProjectCardSkeleton />
                  </>
                ) : (
                  recentTickets.map((ticket) => {
                    const project = projects.find((p) => p.id === ticket.projectId)
                    return (
                      <div
                        key={ticket.id}
                        className="p-6 border border-border/50 rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground">{project?.name}</p>
                          </div>
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <StatusBadge status={ticket.status} />
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {formatRelativeTime(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
