import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getProjectById } from "../../../lib/mock-data"

export default function ProjectAnalyticsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    const projectData = getProjectById(projectId)
    if (!projectData) {
      navigate("/admin/dashboard")
      return
    }

    setProject(projectData)
  }, [isSignedIn, user, projectId, navigate])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Mock analytics data
  const analytics = {
    pageViews: 12543,
    uniqueVisitors: 8921,
    bounceRate: 42.3,
    avgSessionDuration: "3:24",
    topPages: [
      { page: "/", views: 4521 },
      { page: "/about", views: 3214 },
      { page: "/services", views: 2890 },
      { page: "/contact", views: 1988 },
    ],
    trafficSources: [
      { source: "Organic Search", sessions: 5234, percentage: 45.2 },
      { source: "Direct", sessions: 3121, percentage: 27.0 },
      { source: "Social Media", sessions: 1890, percentage: 16.3 },
      { source: "Referral", sessions: 1456, percentage: 12.6 },
    ],
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-primary hover:underline mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Analytics for {project.name}
                </h1>
                <p className="text-muted-foreground">Google Analytics data and insights</p>
              </div>
              <div className="flex gap-4">
                <Link to={`/admin/projects/${projectId}`} className="btn-outline">
                  View Project
                </Link>
                <Link to={`/admin/projects/${projectId}/edit`} className="btn-primary">
                  Edit Project
                </Link>
              </div>
            </div>
          </div>

          {/* GA4 Property Info */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Google Analytics Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">GA4 Property ID</div>
                <div className="font-mono text-foreground">
                  {project.googleAnalyticsPropertyId || "Not configured"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analytics View ID (Legacy)</div>
                <div className="font-mono text-foreground">
                  {project.googleAnalyticsViewId || "Not configured"}
                </div>
              </div>
            </div>
            {project.websiteUrl && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">Website URL</div>
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.websiteUrl}
                </a>
              </div>
            )}
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary mb-2">{analytics.pageViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Page Views</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.uniqueVisitors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Unique Visitors</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.bounceRate}%</div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary mb-2">{analytics.avgSessionDuration}</div>
              <div className="text-sm text-muted-foreground">Avg. Session Duration</div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Top Pages</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-primary text-primary-foreground">
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50">Page</th>
                     <th className="px-4 py-3 text-left font-semibold">Page Views</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPages.map((page, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-mono text-sm">{page.page}</td>
                      <td className="px-4 py-3">{page.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="card">
            <h2 className="text-xl font-bold text-foreground mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {analytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-semibold text-foreground">{source.source}</div>
                    <div className="text-sm text-muted-foreground">{source.sessions.toLocaleString()} sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}