"use client"

import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers, deleteProject, mockProjects, getFileShares } from "@/lib/mock-data"
import type { Project, ProjectStage } from "@/types"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { StatCardSkeleton, ProjectCardSkeleton } from "@/components/skeleton"
import { getStageDisplayName, formatRelativeTime } from "@/lib/utils"
import { Edit, Trash2, Calendar, Palette, Code, CheckCircle, Rocket, Wrench, Search } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboard() {
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
    if (user.role !== "admin") {
      // Redirect to appropriate dashboard or home based on role
      switch (user.role) {
        case "web_developer":
          navigate("/developer/dashboard")
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

  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [projects, setProjects] = useState(getProjects())
  const [tickets, setTickets] = useState(getTickets())
  const [users, setUsers] = useState(getUsers())
  const [fileShares, setFileShares] = useState(getFileShares())

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

  const projectStageData = useMemo(() => {
    const allStages: ProjectStage[] = ["planning", "design", "development", "testing", "seo_optimization", "launch", "maintenance"]
    const stageCounts: Record<string, number> = {}
    allStages.forEach(stage => {
      stageCounts[getStageDisplayName(stage)] = 0
    })
    projects.forEach(project => {
      const displayName = getStageDisplayName(project.currentStage)
      stageCounts[displayName] = (stageCounts[displayName] || 0) + 1
    })
    return allStages.map(stage => ({
      name: getStageDisplayName(stage),
      value: stageCounts[getStageDisplayName(stage)]
    }))
  }, [projects])

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Simulate network delay
    return () => clearTimeout(timer)
  }, [])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Refresh data when refreshKey changes
  useEffect(() => {
    setProjects(getProjects())
    setTickets(getTickets())
    setUsers(getUsers())
    setFileShares(getFileShares())
  }, [refreshKey])

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => setRefreshKey(prev => prev + 1)
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Refresh when projects are updated
  useEffect(() => {
    const handleProjectsUpdated = () => setRefreshKey(prev => prev + 1)
    window.addEventListener('projectsUpdated', handleProjectsUpdated)
    return () => window.removeEventListener('projectsUpdated', handleProjectsUpdated)
  }, [])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalUsers: users.length,
    openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
  }

  const recentProjects = projects.slice(0, 5)
  const recentTickets = tickets.slice(0, 5)

  // Group projects by type and month starting from November
  const groupProjectsByMonth = useMemo(() => {
    const grouped: Record<string, Record<string, Project[]>> = {
      website: {},
      social_media: {}
    }

    // Start from November (month 10, 0-indexed)
    const startMonth = 10 // November
    const currentYear = new Date().getFullYear()
    const previousYear = currentYear - 1

    // Initialize months from November of previous year to current month
    const months = [
      'November', 'December', 'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September', 'October'
    ]

    // Initialize all months for both types
    months.forEach((month, index) => {
      const monthIndex = (startMonth + index) % 12
      const year = monthIndex < 2 ? currentYear : previousYear
      grouped.website[`${month} ${year}`] = []
      grouped.social_media[`${month} ${year}`] = []
    })

    // Group projects by type and month
    projects.forEach(project => {
      const projectDate = new Date(project.createdAt)
      const projectMonth = projectDate.getMonth()
      const projectYear = projectDate.getFullYear()

      // Only include projects from November onwards
      if (projectMonth >= 10 || projectYear >= currentYear) {
        const monthIndex = (projectMonth - startMonth + 12) % 12
        const displayMonth = months[monthIndex]
        const displayYear = projectYear
        const key = `${displayMonth} ${displayYear}`

        if (grouped[project.projectType] && grouped[project.projectType][key]) {
          grouped[project.projectType][key].push(project)
        }
      }
    })

    return grouped
  }, [projects])

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      // Remove from localStorage
      const projects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
      const updatedProjects = projects.filter((p: Project) => p.id !== projectId)
      localStorage.setItem("marketing_management_website_projects", JSON.stringify(updatedProjects))

      // Refresh the page to update the list
      window.location.reload()
    }
  }

  const handleRestoreProjects = () => {
    if (window.confirm(`Are you sure you want to restore all ${mockProjects.length} projects? This will replace any existing projects.`)) {
      try {
        localStorage.setItem("marketing_management_website_projects", JSON.stringify(mockProjects))
        alert(`Successfully restored ${mockProjects.length} projects!`)
        window.location.reload()
      } catch (error) {
        alert("Failed to restore projects. Please try again.")
      }
    }
  }

  const getStageIcon = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'planning': return Calendar
      case 'design': return Palette
      case 'development': return Code
      case 'testing': return CheckCircle
      case 'seo_optimization': return Search
      case 'launch': return Rocket
      case 'maintenance': return Wrench
      default: return Calendar
    }
  }

  const stageColors = ['#fbbf24', '#8b5cf6', '#3b82f6', '#10b981', '#06b6d4', '#f59e0b', '#ef4444']



  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
           {/* Header */}
           <div className="mb-12">
             <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
               <div className="flex-1">
                 <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Administrator Dashboard</h1>
                 <p className="text-lg text-muted-foreground leading-relaxed">Welcome back, Administrator {user.fullName}! Here&apos;s your complete system overview and management controls.</p>
               </div>
               <div className="flex gap-3 lg:flex-shrink-0">
                 <div className="flex flex-col gap-2">
                   <button
                     onClick={handleRestoreProjects}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                     title="Restore all projects to original state"
                   >
                     🔄 Restore Projects ({mockProjects.length})
                   </button>
                   <button
                     onClick={() => {
                       const projectsData = JSON.stringify(mockProjects, null, 2);
                       navigator.clipboard.writeText(projectsData).then(() => {
                         alert('Projects data copied to clipboard! Open browser console and run the manual restore command.');
                       }).catch(() => {
                         alert('Failed to copy. Open browser console and paste this command: \n\nlocalStorage.setItem("marketing_management_website_projects", ' + JSON.stringify(projectsData) + ');\nwindow.location.reload();');
                       });
                     }}
                     className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                     title="Manual restore for deployed site"
                   >
                     📋 Manual Restore (Console)
                   </button>
                 </div>
               </div>
             </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-website" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website Projects
                    </h3>
                    <Link to="/admin/projects/website" className="w-full bg-website hover:bg-website-hover text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
                      </svg>
                      Manage Website Projects
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-social" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      Social Media Projects
                    </h3>
                    <Link to="/admin/projects/social-media" className="w-full bg-social hover:bg-social-hover text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
                      </svg>
                      Manage Social Media Projects
                    </Link>
                  </div>

                 <div className="space-y-3">
                   <h3 className="text-lg font-semibold text-foreground">General</h3>
                   <Link to="/admin/projects/new" className="w-full btn-primary flex items-center justify-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                     </svg>
                     Add New Project
                   </Link>
                 </div>
             </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin/projects" className="btn-outline flex items-center justify-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
                 </svg>
                 All Projects
               </Link>
               <Link to="/admin/users" className="btn-outline flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
                 Manage Users
               </Link>
               <Link to="/admin/tickets" className="btn-outline flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                 </svg>
                 View Tickets
               </Link>
               <Link to="/analytics" className="btn-outline flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
                 View Analytics
               </Link>
             </div>
            </div>

            {/* Project Stages Summary */}
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Stages Summary</h3>
               <ResponsiveContainer width="100%" height={400}>
                 <BarChart data={projectStageData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis
                     dataKey="name"
                     angle={-45}
                     textAnchor="end"
                     height={120}
                     interval={0}
                   />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {projectStageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stageColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Total projects across all stages: {projectStageData.reduce((sum, stage) => sum + stage.value, 0)}
              </div>
             </div>

            {/* Monthly Project Overview */}
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Monthly Project Overview (From November)</h2>
                <Link to="/admin/projects/new" className="btn-primary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Project
                </Link>
              </div>

              <div className="space-y-8">
                {/* Website Projects */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupProjectsByMonth.website).map(([monthYear, projects]) => (
                      <div key={monthYear} className="border border-border rounded-lg p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                        <h4 className="font-semibold text-foreground mb-2">{monthYear}</h4>
                        <div className="space-y-2">
                          {projects.length > 0 ? (
                            projects.map(project => (
                              <div key={project.id} className="text-sm bg-white/70 rounded p-2 border">
                                <div className="font-medium text-foreground truncate">{project.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {users.find(u => u.id === project.clientId)?.fullName || 'Unknown Client'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StatusBadge status={project.status} />
                                  <span className="text-xs text-muted-foreground">
                                    {getStageDisplayName(project.currentStage)}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground italic text-center py-4">
                              No projects this month
                            </div>
                          )}
                        </div>
                        {projects.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                              Total: {projects.length} project{projects.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media Projects */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Social Media Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupProjectsByMonth.social_media).map(([monthYear, projects]) => (
                      <div key={monthYear} className="border border-border rounded-lg p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                        <h4 className="font-semibold text-foreground mb-2">{monthYear}</h4>
                        <div className="space-y-2">
                          {projects.length > 0 ? (
                            projects.map(project => (
                              <div key={project.id} className="text-sm bg-white/70 rounded p-2 border">
                                <div className="font-medium text-foreground truncate">{project.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {users.find(u => u.id === project.clientId)?.fullName || 'Unknown Client'}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StatusBadge status={project.status} />
                                  <span className="text-xs text-muted-foreground">
                                    {getStageDisplayName(project.currentStage)}
                                  </span>
                                </div>
                                {project.socialMediaPlatforms && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {project.socialMediaPlatforms.slice(0, 3).map(platform => (
                                      <span key={platform} className="inline-block px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                        {platform}
                                      </span>
                                    ))}
                                    {project.socialMediaPlatforms.length > 3 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{project.socialMediaPlatforms.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground italic text-center py-4">
                              No projects this month
                            </div>
                          )}
                        </div>
                        {projects.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                              Total: {projects.length} project{projects.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Website Projects Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 mb-8 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
<h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website Projects
                </h2>
                    <p className="text-blue-700 mt-2 text-lg">Manage all website development projects by month</p>
                  </div>
                  <Link to="/admin/projects/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Website Project
                  </Link>
                </div>

                <div className="card border-blue-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-blue-200">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Month</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Project Name</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Client</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Status</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Stage</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-blue-200 text-blue-900">Developer</th>
                          <th className="px-4 py-3 text-left font-semibold text-blue-900">Website URL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupProjectsByMonth.website).map(([monthYear, monthProjects]) =>
                          monthProjects.length > 0 ? (
                            monthProjects.map((project, index) => {
                              const client = users.find(u => u.id === project.clientId)
                              const developer = users.find(u => u.id === project.webDeveloperId)
                              return (
                                <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/50"}>
                                  {index === 0 && (
                                    <td className="px-4 py-3 font-semibold text-blue-700 border-r border-blue-200" rowSpan={monthProjects.length}>
                                      {monthYear}
                                      <div className="text-xs text-blue-600 mt-1 font-medium">
                                        ({monthProjects.length} project{monthProjects.length !== 1 ? 's' : ''})
                                      </div>
                                    </td>
                                  )}
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
                                  <td className="px-4 py-3">
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
                                </tr>
                              )
                            })
                          ) : (
                            <tr key={monthYear} className="bg-blue-25">
                              <td className="px-4 py-3 font-semibold text-blue-700 border-r border-blue-200">{monthYear}</td>
                              <td colSpan={6} className="px-4 py-8 text-center text-blue-500 italic border-r border-blue-200">
                                No website projects this month
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Projects Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 mb-8 border border-purple-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
<h2 className="text-3xl font-bold text-purple-900 flex items-center gap-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Social Media Projects
                </h2>
                    <p className="text-purple-700 mt-2 text-lg">Manage all social media campaign projects by month</p>
                  </div>
                  <Link to="/admin/projects/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Social Media Project
                  </Link>
                </div>

                <div className="card border-purple-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-purple-200">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Month</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Project Name</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Client</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Status</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Stage</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Coordinator</th>
                          <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Platforms</th>
                          <th className="px-4 py-3 text-left font-semibold text-purple-900">Goals</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupProjectsByMonth.social_media).map(([monthYear, monthProjects]) =>
                          monthProjects.length > 0 ? (
                            monthProjects.map((project, index) => {
                              const client = users.find(u => u.id === project.clientId)
                              const coordinator = users.find(u => u.id === project.socialMediaCoordinatorId)
                              return (
                                <tr key={project.id} className={index % 2 === 0 ? "bg-white" : "bg-purple-50/50"}>
                                  {index === 0 && (
                                    <td className="px-4 py-3 font-semibold text-purple-700 border-r border-purple-200" rowSpan={monthProjects.length}>
                                      {monthYear}
                                      <div className="text-xs text-purple-600 mt-1 font-medium">
                                        ({monthProjects.length} project{monthProjects.length !== 1 ? 's' : ''})
                                      </div>
                                    </td>
                                  )}
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
                                    <StatusBadge status={project.status} />
                                  </td>
                                  <td className="px-4 py-3 border-r border-purple-200">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                      {getStageDisplayName(project.currentStage)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 border-r border-purple-200">
                                    <div className="text-sm">
                                      {coordinator ? (
                                        <>
                                          <div className="font-medium text-purple-900">{coordinator.fullName}</div>
                                          <div className="text-xs text-purple-600">{coordinator.email}</div>
                                        </>
                                      ) : (
                                        <span className="text-xs text-purple-500 italic">Not assigned</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 border-r border-purple-200">
                                    {project.socialMediaPlatforms ? (
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
                                  <td className="px-4 py-3">
                                    {project.campaignGoals ? (
                                      <div className="text-sm text-purple-700 max-w-xs truncate font-medium" title={project.campaignGoals}>
                                        {project.campaignGoals}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-purple-500 italic">Not set</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr key={monthYear} className="bg-purple-25">
                              <td className="px-4 py-3 font-semibold text-purple-700 border-r border-purple-200">{monthYear}</td>
                              <td colSpan={7} className="px-4 py-8 text-center text-purple-500 italic border-r border-purple-200">
                                No social media projects this month
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                   {paginatedProjects.map((project, index) => {
                     const client = users.find((u) => u.id === project.clientId)
                     const developer = users.find((u) => u.id === project.webDeveloperId)
                     const coordinator = users.find((u) => u.id === project.socialMediaCoordinatorId)
                      const ticketCount = getTickets().filter(t => t.projectId === project.id).length

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
                 <Link to="/admin/tickets" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
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

            {/* Client Files Section */}
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Recent Client Files ({fileShares.length})
                </h2>
              </div>
              <div className="space-y-4">
                {fileShares.length > 0 ? (
                  fileShares.slice(0, 10).map((file) => {
                    const project = projects.find(p => p.id === file.projectId)
                    const uploader = users.find(u => u.id === file.uploadedBy)
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{file.fileName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project?.name} • Uploaded by {uploader?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(file.uploadedAt)} • {(file.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-xs px-3 py-1"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-muted-foreground">No client files uploaded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Files uploaded by clients will appear here</p>
                  </div>
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
