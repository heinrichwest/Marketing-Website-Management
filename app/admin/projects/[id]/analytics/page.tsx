import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjects } from "@/lib/mock-data"
import type { MonthlyAnalytics, Project } from "@/types"
import { ArrowLeft, Calendar, TrendingUp, Users, MousePointer, Share2 } from "lucide-react"

const STORAGE_KEY = "marketing_management_monthly_analytics"

export default function ProjectAnalyticsPage() {
  const { id } = useParams()
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [analytics, setAnalytics] = useState<MonthlyAnalytics[]>([])
  const [loading, setLoading] = useState(true)

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

    // Load project
    const projects = getProjects()
    const foundProject = projects.find(p => p.id === id)

    if (!foundProject) {
      navigate("/admin/dashboard")
      return
    }

    setProject(foundProject)

    // Load analytics for this project
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allAnalytics: MonthlyAnalytics[] = JSON.parse(stored)
      const projectAnalytics = allAnalytics.filter(a => a.projectId === id)
      // Sort by month (newest first)
      projectAnalytics.sort((a, b) => b.month.localeCompare(a.month))
      setAnalytics(projectAnalytics)
    }

    setLoading(false)
  }, [isSignedIn, user, navigate, id])

  if (!user || user.role !== "admin" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Calculate totals
  const totals = analytics.reduce((acc, curr) => ({
    userEngagement: acc.userEngagement + curr.userEngagement,
    newUsers: acc.newUsers + curr.newUsers,
    clicks: acc.clicks + curr.clicks,
    referrals: acc.referrals + curr.referrals,
  }), { userEngagement: 0, newUsers: 0, clicks: 0, referrals: 0 })

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
                  <TrendingUp className="w-10 h-10 text-green-600" />
                  Analytics: {project.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-2">
                  Monthly analytics data for this project. Total entries: {analytics.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {project.projectType === "website" ? "🌐 Website" : "📱 Social Media"}
                  </span>
                  {project.clientId && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Client ID: {project.clientId}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 lg:flex-shrink-0">
                <Link
                  to="/admin/analytics/monthly"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Manage Analytics
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="btn-outline flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {analytics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total</span>
                </div>
                <div className="text-3xl font-bold mb-1">{totals.userEngagement.toLocaleString()}</div>
                <div className="text-sm opacity-90">User Engagement</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total</span>
                </div>
                <div className="text-3xl font-bold mb-1">{totals.newUsers.toLocaleString()}</div>
                <div className="text-sm opacity-90">New Users</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <MousePointer className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total</span>
                </div>
                <div className="text-3xl font-bold mb-1">{totals.clicks.toLocaleString()}</div>
                <div className="text-sm opacity-90">Clicks</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Share2 className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total</span>
                </div>
                <div className="text-3xl font-bold mb-1">{totals.referrals.toLocaleString()}</div>
                <div className="text-sm opacity-90">Referrals</div>
              </div>
            </div>
          )}

          {/* Analytics Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-600" />
                Monthly Analytics Data
              </h2>
            </div>

            {analytics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/50">
                      <th className="px-6 py-4 text-left font-semibold text-foreground">#</th>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Month</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">User Engagement</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">New Users</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Clicks</th>
                      <th className="px-6 py-4 text-right font-semibold text-foreground">Referrals</th>
                      <th className="px-6 py-4 text-left font-semibold text-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-foreground">
                              {formatMonth(entry.month)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {entry.userEngagement.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {entry.newUsers.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                            {entry.clicks.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                            {entry.referrals.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {entry.notes || <span className="italic">No notes</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground mb-6">
                  There are no monthly analytics entries for this project yet.
                </p>
                <Link
                  to="/admin/analytics/monthly"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Add Analytics Data
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
