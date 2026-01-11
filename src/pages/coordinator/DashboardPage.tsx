import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getSocialMediaAnalytics } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import { getStageDisplayName, formatDate, formatNumber } from "@/lib/utils"

export default function CoordinatorDashboard() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "social_media_coordinator") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "social_media_coordinator") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const myProjects = getProjectsByUserId(user.id, user.role)
  const allAnalytics = getSocialMediaAnalytics()

  // Get analytics for user's projects
  const myProjectIds = myProjects.map((p) => p.id)
  const myAnalytics = allAnalytics.filter((a) => myProjectIds.includes(a.projectId))

  const totalReach = myAnalytics.reduce((sum, a) => sum + a.reach, 0)
  const totalEngagement = myAnalytics.reduce((sum, a) => sum + a.engagement, 0)
  const totalPosts = myAnalytics.reduce((sum, a) => sum + a.posts, 0)

  const stats = {
    assignedProjects: myProjects.length,
    totalReach,
    totalEngagement,
    totalPosts,
  }

  const recentProjects = myProjects.slice(0, 3)
  const recentAnalytics = myAnalytics.slice(0, 5)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Social Media Coordinator Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}! Here&apos;s your analytics overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Assigned Projects"
              value={stats.assignedProjects}
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
              title="Total Reach"
              value={formatNumber(stats.totalReach)}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Total Engagement"
              value={formatNumber(stats.totalEngagement)}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
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
                <Link to="/coordinator/analytics/new" className="btn-outline hover:border-accent hover:text-accent">
                  + Add Analytics Entry
                </Link>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Projects</h2>
                <Link to="/coordinator/projects" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>

              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            {project.projectType === "social_media" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Social Media
                              </span>
                            )}
                            {project.projectType === "website" && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                Website
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm mt-3 flex-wrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-medium">
                          {getStageDisplayName(project.currentStage)}
                        </span>
                        {project.projectType === "social_media" && project.socialMediaPlatforms && (
                          <div className="flex gap-1">
                            {project.socialMediaPlatforms.slice(0, 3).map((platform) => (
                              <span
                                key={platform}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 capitalize"
                              >
                                {platform}
                              </span>
                            ))}
                            {project.socialMediaPlatforms.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                +{project.socialMediaPlatforms.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects assigned yet.</p>
                </div>
              )}
            </div>

            {/* Recent Analytics */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Analytics Entries</h2>
                <Link to="/coordinator/analytics/new" className="text-primary hover:underline text-sm">
                  + Add Entry
                </Link>
              </div>

              {recentAnalytics.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalytics.map((analytics) => {
                    const project = myProjects.find((p) => p.id === analytics.projectId)
                    return (
                      <div
                        key={analytics.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground capitalize">{analytics.platform}</h3>
                            <p className="text-sm text-muted-foreground">{project?.name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(analytics.date)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="text-center p-2 bg-muted rounded">
                            <p className="text-xs text-muted-foreground">Reach</p>
                            <p className="font-semibold text-foreground">{formatNumber(analytics.reach)}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <p className="text-xs text-muted-foreground">Engagement</p>
                            <p className="font-semibold text-foreground">{formatNumber(analytics.engagement)}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <p className="text-xs text-muted-foreground">Posts</p>
                            <p className="font-semibold text-foreground">{analytics.posts}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No analytics entries yet.</p>
                  <Link to="/coordinator/analytics/new" className="text-primary hover:underline text-sm mt-2 inline-block">
                    Add your first entry
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
