import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getSocialMediaAnalytics } from "@/lib/mock-data"
import type { Project, SocialMediaAnalytics } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format, subDays } from "date-fns"

export default function CoordinatorAnalyticsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<Project[]>([])
  const [analytics, setAnalytics] = useState<SocialMediaAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data asynchronously to prevent blocking
  const loadData = useCallback(async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate async loading (in real app, this would be API calls)
    await new Promise(resolve => setTimeout(resolve, 100))

    // Load only the data we need
    const allProjects = getProjects()
    const allAnalytics = getSocialMediaAnalytics()

    // Filter data efficiently
    const assignedProjects = allProjects.filter((p: Project) =>
      p.projectType === "social_media" && p.socialMediaCoordinatorId === user.id
    )
    const projectAnalytics = allAnalytics.filter((a: SocialMediaAnalytics) =>
      assignedProjects.some((p: Project) => p.id === a.projectId)
    )

    setProjects(assignedProjects)
    setAnalytics(projectAnalytics)
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user || user.role !== "social_media_coordinator") {
      navigate("/dashboard")
      return
    }

    loadData()
  }, [user, isSignedIn, navigate, loadData])

  // Memoize expensive calculations
  const recentAnalytics = useMemo(() =>
    analytics.filter((a: SocialMediaAnalytics) => {
      const sevenDaysAgo = subDays(new Date(), 7)
      return a.date >= sevenDaysAgo
    }), [analytics]
  )

  const totalReach = useMemo(() =>
    analytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.reach, 0), [analytics]
  )

  const totalEngagement = useMemo(() =>
    analytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.engagement, 0), [analytics]
  )

  const totalPosts = useMemo(() =>
    analytics.reduce((sum: number, a: SocialMediaAnalytics) => sum + a.posts, 0), [analytics]
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }



  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-outline text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Social Media Analytics</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Monitor your social media performance across all assigned projects and platforms
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEngagement.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Engagement</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects and Recent Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">My Social Media Projects</h3>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <div className="flex gap-1 mt-1">
                          {project.socialMediaPlatforms?.slice(0, 3).map((platform) => (
                            <span key={platform} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 capitalize">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <a
                        href={`/analytics/${project.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        View Details
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No social media projects assigned yet.</p>
                  <a href="/coordinator/analytics/new" className="btn-primary">
                    Add Analytics Entry
                  </a>
                </div>
              )}
            </div>

            {/* Recent Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Analytics (Last 7 Days)</h3>
              {recentAnalytics.length > 0 ? (
                <div className="space-y-3">
                  {recentAnalytics.slice(0, 5).map((entry) => {
                    const project = projects.find(p => p.id === entry.projectId)
                    return (
                      <div key={entry.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground">{project?.name}</p>
                          <span className="text-sm text-muted-foreground capitalize">{entry.platform}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Reach</p>
                            <p className="font-medium">{entry.reach.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Engagement</p>
                            <p className="font-medium">{entry.engagement.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Posts</p>
                            <p className="font-medium">{entry.posts}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(entry.date, "MMM dd, yyyy")}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No recent analytics entries.</p>
                  <a href="/coordinator/analytics/new" className="btn-primary">
                    Add First Entry
                  </a>
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