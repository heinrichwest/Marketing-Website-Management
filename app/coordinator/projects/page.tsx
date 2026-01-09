import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getSocialMediaAnalytics } from "@/lib/mock-data"
import StatusBadge from "@/components/status-badge"
import { getStageDisplayName, formatDate } from "@/lib/utils"
import type { Project } from "@/types"

export default function CoordinatorProjectsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [analytics, setAnalytics] = useState<Record<string, any>>({})

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
    }
  }, [user])

  if (!user || user.role !== "social_media_coordinator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getProjectAnalyticsSummary = (projectId: string) => {
    const projectAnalytics = analytics[projectId] || []
    const totalReach = projectAnalytics.reduce((sum: number, a: any) => sum + a.reach, 0)
    const totalEngagement = projectAnalytics.reduce((sum: number, a: any) => sum + a.engagement, 0)
    const totalPosts = projectAnalytics.reduce((sum: number, a: any) => sum + a.posts, 0)

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
            <h1 className="text-4xl font-bold text-foreground mb-2">My Projects</h1>
            <p className="text-muted-foreground">Manage your assigned social media projects</p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const analyticsSummary = getProjectAnalyticsSummary(project.id)
              return (
                <div
                  key={project.id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                          {project.projectType === "social_media" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Social Media
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stage:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                          {getStageDisplayName(project.currentStage)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Analytics Entries:</span>
                        <span className="font-medium">{analyticsSummary.entryCount}</span>
                      </div>

                      {analyticsSummary.entryCount > 0 && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Reach:</span>
                            <span className="font-medium">{analyticsSummary.totalReach.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Engagement:</span>
                            <span className="font-medium">{analyticsSummary.totalEngagement.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {project.socialMediaPlatforms && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Platforms:</p>
                        <div className="flex gap-1 flex-wrap">
                          {project.socialMediaPlatforms.slice(0, 4).map((platform) => (
                            <span
                              key={platform}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 capitalize"
                            >
                              {platform}
                            </span>
                          ))}
                          {project.socialMediaPlatforms.length > 4 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                              +{project.socialMediaPlatforms.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/analytics/${project.id}`}
                        className="flex-1 btn-outline text-sm text-center"
                      >
                        View Analytics
                      </Link>
                      <Link
                        to={`/coordinator/analytics/new`}
                        className="btn-primary text-sm text-center px-4 py-2"
                      >
                        + Add Entry
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects assigned yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}