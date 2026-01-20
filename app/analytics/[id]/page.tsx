"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectById, getAnalyticsByProjectId } from "@/lib/mock-data"
import type { Project, WebsiteAnalytics, SocialMediaAnalytics } from "@/types"

export default function AnalyticsPage() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [analytics, setAnalytics] = useState<{
    website: WebsiteAnalytics[]
    social: SocialMediaAnalytics[]
  }>({ website: [], social: [] })

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

    // Load analytics data
    const analyticsData = getAnalyticsByProjectId(projectId)
    setAnalytics(analyticsData)
  }, [isSignedIn, projectId, navigate])

  if (!project) {
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

          {/* Website Analytics Summary */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Website Analytics Summary</h2>
            </div>

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