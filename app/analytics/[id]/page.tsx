import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getProjectById, getAnalyticsByProjectId } from "@/lib/mock-data"
import type { Project, WebsiteAnalytics, SocialMediaAnalytics } from "@/types"

export default function AnalyticsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

   const [project, setProject] = useState<Project | null>(null)
   const [analytics, setAnalytics] = useState<any>(null)
   const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
   const [analyticsError, setAnalyticsError] = useState<string | null>(null)

   useEffect(() => {
     if (!isSignedIn) {
       navigate("/login")
       return
     }

     const projectData = getProjectById(projectId)
     if (!projectData) {
       navigate("/dashboard")
       return
     }

     setProject(projectData)

      // Try to fetch real analytics if GA property ID is valid
      if (projectData.googleAnalyticsPropertyId && (/^G-\d+$/.test(projectData.googleAnalyticsPropertyId) || /^\d+$/.test(projectData.googleAnalyticsPropertyId))) {
        fetchRealAnalytics(projectData.googleAnalyticsPropertyId)
      } else {
        // Fall back to mock data
        const analyticsData = getAnalyticsByProjectId(projectId)
        setAnalytics(analyticsData)
      }
   }, [isSignedIn, projectId, navigate])

   const fetchRealAnalytics = async (propertyId: string) => {
     setIsLoadingAnalytics(true)
     setAnalyticsError(null)

     try {
       const response = await fetch(`http://localhost:3001/api/analytics/${propertyId}`)
       if (!response.ok) {
         throw new Error(`API Error: ${response.status} ${response.statusText}`)
       }
       const data = await response.json()
       setAnalytics(data)
     } catch (error) {
       console.error('Failed to fetch real analytics:', error)
       setAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch analytics')
       // Fall back to mock data
       const analyticsData = getAnalyticsByProjectId(projectId)
       setAnalytics(analyticsData)
     } finally {
       setIsLoadingAnalytics(false)
     }
   }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Function to generate Google Analytics URL and validate IDs
  const getGoogleAnalyticsUrl = () => {
    // Validate GA4 Property ID format (G- followed by digits or just digits)
    if (project.googleAnalyticsPropertyId && (/^G-\d+$/.test(project.googleAnalyticsPropertyId) || /^\d+$/.test(project.googleAnalyticsPropertyId))) {
      // Google Analytics 4 (GA4) URL format
      const propertyId = project.googleAnalyticsPropertyId.startsWith('G-')
        ? project.googleAnalyticsPropertyId.substring(2) // Remove G-
        : project.googleAnalyticsPropertyId; // Already numeric
      return `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/intelligenthome`
    }
    // Validate legacy View ID format (digits only)
    else if (project.googleAnalyticsViewId && /^\d+$/.test(project.googleAnalyticsViewId)) {
      // Universal Analytics URL format (legacy)
      return `https://analytics.google.com/analytics/web/#/report-home/a${project.googleAnalyticsViewId}`
    }
    return null
  }

  const gaUrl = getGoogleAnalyticsUrl()

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-4xl font-bold text-foreground mb-2">Analytics - {project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {project.websiteUrl}
              </a>
            )}
          </div>

          {/* Google Analytics Integration */}
          {gaUrl ? (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Live Google Analytics</h2>
              <p className="text-muted-foreground mb-6">
                View real-time analytics data for this website directly in Google Analytics.
              </p>

              <div className="space-y-4">
                <a
                  href={gaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e2875] to-[#2a3488] text-white rounded-lg font-semibold hover:from-[#2a3488] hover:to-[#1e2875] transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3177 2.9897-2.965 2.9984H4.1065c-1.647-.0087-2.9735-1.351-2.965-2.9983V2.9982C1.133 1.3509 2.4596.0086 4.1066 0h15.769c1.6472.0086 2.9735 1.351 2.9649 2.9983zm-5.9207 5.557L12.2649 0H4.1066C2.9465.0009 2.007.9398 1.999 2.0998v18.0005c.008 1.16.9405 2.0989 2.1005 2.0997h15.7674c1.16-.0008 2.0926-.9397 2.1006-2.0997V8.556h-5.112zm-6.1505 9.4836c-.5513.5645-1.3086.8815-2.1007.8796-.792.0019-1.5494-.315-2.1007-.8796-.5519-.5646-.8615-1.3304-.8595-2.1252-.002-.7948.3076-1.5606.8595-2.1252.5513-.5645 1.3086-.8815 2.1007-.8795.792-.002 1.5494.315 2.1007.8795.5518.5646.8614 1.3304.8594 2.1252.002.7948-.3076 1.5606-.8594 2.1252z" />
                  </svg>
                  Open Google Analytics Dashboard
                </a>

                <div className="bg-secondary/10 border-l-4 border-primary p-4 rounded">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Google Analytics Access Required</h3>
                      <p className="text-sm text-primary/80">
                        You need to be logged into Google Analytics and have access to this property (
                        {project.googleAnalyticsPropertyId || project.googleAnalyticsViewId}) to view the reports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Analytics Option */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Want Embedded Analytics?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  To embed Google Analytics reports directly on this page, you'll need to:
                </p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Set up Google Analytics Embed API</li>
                  <li>Create a service account in Google Cloud</li>
                  <li>Authorize the service account in Google Analytics</li>
                  <li>Implement the embedding code</li>
                </ol>
                <a
                  href="https://developers.google.com/analytics/devguides/reporting/embed/v1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Learn about Google Analytics Embed API
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ) : (
            <div className="card mb-8 bg-yellow-50 border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <svg
                  className="w-8 h-8 text-yellow-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">Google Analytics Not Configured</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    This project doesn't have a Google Analytics Property ID configured yet.
                  </p>
                  <p className="text-sm text-yellow-800">
                    Contact your administrator to add the Google Analytics Property ID for this project.
                  </p>
                </div>
              </div>
            </div>
          )}

           {/* Website Analytics Summary */}
           <div className="card mb-8">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-foreground">Website Analytics Summary</h2>
               <div className="flex items-center gap-4">
                  {project?.googleAnalyticsPropertyId && (/^G-\d+$/.test(project.googleAnalyticsPropertyId) || /^\d+$/.test(project.googleAnalyticsPropertyId)) && (
                   <button
                     onClick={() => fetchRealAnalytics(project.googleAnalyticsPropertyId!)}
                     disabled={isLoadingAnalytics}
                     className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                     Refresh Data
                   </button>
                 )}
                 {isLoadingAnalytics && (
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                     Fetching real data...
                   </div>
                 )}
               </div>
             </div>

             {analyticsError && (
               <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                 <div className="flex items-start gap-3">
                   <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                   <div>
                     <h3 className="font-semibold text-yellow-900 mb-1">Analytics Fetch Error</h3>
                     <p className="text-sm text-yellow-800">{analyticsError}</p>
                     <p className="text-sm text-yellow-800 mt-2">Showing cached/manual data instead.</p>
                   </div>
                 </div>
               </div>
             )}

             {analytics.website && analytics.website.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analytics.website.slice(0, 3).map((data: WebsiteAnalytics) => (
                  <div key={data.id} className="p-6 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-lg border border-secondary/20">
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Page Views</p>
                        <p className="text-2xl font-bold text-[#1e2875]">{data.pageViews.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Unique Visitors</p>
                        <p className="text-xl font-semibold text-foreground">{data.uniqueVisitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bounce Rate</p>
                        <p className="text-lg font-medium text-foreground">{data.bounceRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No analytics data available yet.</p>
            )}
          </div>

          {/* Social Media Analytics */}
          <div className="card">
            <h2 className="text-2xl font-bold text-foreground mb-6">Social Media Analytics</h2>

            {analytics.social && analytics.social.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.social.map((data: SocialMediaAnalytics) => (
                  <div key={data.id} className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 capitalize">
                        {data.platform}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Posts</p>
                        <p className="text-lg font-bold text-[#1e2875]">{data.posts}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                        <p className="text-lg font-bold text-foreground">{data.engagement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reach</p>
                        <p className="text-lg font-semibold text-foreground">{data.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Followers</p>
                        <p className="text-lg font-semibold text-foreground">{data.followers?.toLocaleString() || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No social media analytics data available yet.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
