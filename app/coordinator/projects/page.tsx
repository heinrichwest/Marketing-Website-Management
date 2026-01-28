import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useMemo } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getSocialMediaAnalytics, getProjects, getUsers } from "@/lib/mock-data"
import StatusBadge from "@/components/status-badge"
import { getStageDisplayName, formatDate } from "@/lib/utils"
import type { Project, SocialMediaAnalytics } from "@/types"

export default function CoordinatorProjectsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [analytics, setAnalytics] = useState<Record<string, any>>({})
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "social_media_coordinator") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  useEffect(() => {
    if (user) {
      const userProjects = getProjectsByUserId(user.id, user.role)
      setProjects(userProjects)

      // Get analytics for each project
      const allAnalytics = getSocialMediaAnalytics()
      const analyticsMap: Record<string, any> = {}
      userProjects.forEach(project => {
        const projectAnalytics = allAnalytics.filter(a => a.projectId === project.id)
        analyticsMap[project.id] = projectAnalytics
      })
      setAnalytics(analyticsMap)

      // Load all projects and users for the table
      setAllProjects(getProjects())
      setUsers(getUsers())
    }
  }, [user])

  if (!user || user.role !== "social_media_coordinator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Group social media projects by month (only assigned to this coordinator)
  const groupProjectsByMonth = useMemo(() => {
    const grouped: Record<string, Project[]> = {}

    // Only include social media projects assigned to this coordinator
    const coordinatorSocialMediaProjects = allProjects.filter(project =>
      project.projectType === "social_media" &&
      project.socialMediaCoordinatorId === user?.id
    )

    coordinatorSocialMediaProjects.forEach(project => {
      const date = new Date(project.createdAt)
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }
      grouped[monthYear].push(project)
    })

    return grouped
  }, [allProjects, user])

  const getProjectAnalyticsSummary = (projectId: string) => {
    const projectAnalytics = analytics[projectId] || []
    const totalReach = projectAnalytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.reach, 0)
    const totalEngagement = projectAnalytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.engagement, 0)
    const totalPosts = projectAnalytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.posts, 0)

    return { totalReach, totalEngagement, totalPosts, entryCount: projectAnalytics.length }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
           {/* Header */}
           <div className="mb-8">
             <div className="flex items-center gap-4 mb-4">
               <button
                 onClick={() => navigate("/coordinator/dashboard")}
                 className="btn-outline text-sm"
               >
                 ← Back to Dashboard
               </button>
             </div>
             <h1 className="text-4xl font-bold text-foreground mb-2">Social Media Projects</h1>
             <p className="text-muted-foreground">Manage your assigned social media campaign projects by month</p>
           </div>

           {/* Social Media Projects Monthly Table */}
           <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
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
                       <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Platforms</th>
                       <th className="px-4 py-3 text-left font-semibold text-purple-900">Goals</th>
                     </tr>
                   </thead>
                   <tbody>
                     {Object.entries(groupProjectsByMonth).map(([monthYear, monthProjects]) =>
                       monthProjects.length > 0 ? (
                         monthProjects.map((project, index) => {
                           const client = users.find(u => u.id === project.clientId)
                           const analyticsSummary = getProjectAnalyticsSummary(project.id)
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
                                 <div className="text-xs text-purple-600 mt-1">
                                   Analytics: {analyticsSummary.entryCount} entries
                                   {analyticsSummary.totalReach > 0 && ` • Reach: ${analyticsSummary.totalReach.toLocaleString()}`}
                                 </div>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <div className="text-sm text-purple-800">{client?.fullName || 'Unknown Client'}</div>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <StatusBadge status={project.status} />
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <span className="text-sm text-purple-700 font-medium">
                                   {getStageDisplayName(project.currentStage)}
                                 </span>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 {project.socialMediaPlatforms ? (
                                   <div className="flex flex-wrap gap-1">
                                     {project.socialMediaPlatforms.slice(0, 2).map(platform => (
                                       <span key={platform} className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded capitalize">
                                         {platform}
                                       </span>
                                     ))}
                                     {project.socialMediaPlatforms.length > 2 && (
                                       <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                         +{project.socialMediaPlatforms.length - 2}
                                       </span>
                                     )}
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
                       ) : null
                     )}
                     {Object.keys(groupProjectsByMonth).length === 0 && (
                       <tr>
                         <td colSpan={7} className="px-4 py-8 text-center text-purple-500 italic border-r border-purple-200">
                           No social media projects assigned to you yet
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>

           {/* Header */}
           <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Projects</h1>
            <p className="text-muted-foreground">Manage your assigned social media projects</p>
           </div>

           {/* Social Media Projects Monthly Table */}
           <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 border border-purple-200">
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
                       <th className="px-4 py-3 text-left font-semibold border-r border-purple-200 text-purple-900">Platforms</th>
                       <th className="px-4 py-3 text-left font-semibold text-purple-900">Goals</th>
                     </tr>
                   </thead>
                   <tbody>
                     {Object.entries(groupProjectsByMonth).map(([monthYear, monthProjects]) =>
                       monthProjects.length > 0 ? (
                         monthProjects.map((project, index) => {
                           const client = users.find(u => u.id === project.clientId)
                           const analyticsSummary = getProjectAnalyticsSummary(project.id)
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
                                 <div className="text-xs text-purple-600 mt-1">
                                   Analytics: {analyticsSummary.entryCount} entries
                                   {analyticsSummary.totalReach > 0 && ` • Reach: ${analyticsSummary.totalReach.toLocaleString()}`}
                                 </div>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <div className="text-sm text-purple-800">{client?.fullName || 'Unknown Client'}</div>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <StatusBadge status={project.status} />
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 <span className="text-sm text-purple-700 font-medium">
                                   {getStageDisplayName(project.currentStage)}
                                 </span>
                               </td>
                               <td className="px-4 py-3 border-r border-purple-200">
                                 {project.socialMediaPlatforms ? (
                                   <div className="flex flex-wrap gap-1">
                                     {project.socialMediaPlatforms.slice(0, 2).map(platform => (
                                       <span key={platform} className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded capitalize">
                                         {platform}
                                       </span>
                                     ))}
                                     {project.socialMediaPlatforms.length > 2 && (
                                       <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                         +{project.socialMediaPlatforms.length - 2}
                                       </span>
                                     )}
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
                       ) : null
                     )}
                     {Object.keys(groupProjectsByMonth).length === 0 && (
                       <tr>
                         <td colSpan={7} className="px-4 py-8 text-center text-purple-500 italic border-r border-purple-200">
                           No social media projects assigned to you yet
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
            </div>
        </div>
      </main>

      <Footer />
    </>
  )
}