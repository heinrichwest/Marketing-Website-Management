import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, addSocialMediaAnalytics } from "@/lib/mock-data"
import type { SocialMediaAnalytics, SocialMediaPlatform } from "@/types"

export default function NewAnalyticsEntryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    projectId: "",
    platform: "instagram",
    date: new Date().toISOString().split('T')[0],
    reach: "",
    engagement: "",
    posts: "",
    notes: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user || user.role !== "social_media_coordinator") {
    return null
  }

  const myProjects = getProjectsByUserId(user.id, user.role)
  const socialMediaProjects = myProjects.filter(p => p.projectType === "social_media")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.projectId || !formData.reach || !formData.engagement || !formData.posts) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const newEntry: SocialMediaAnalytics = {
        id: `analytics-${Date.now()}`,
        projectId: formData.projectId,
         platform: formData.platform as SocialMediaPlatform,
        date: new Date(formData.date),
        reach: parseInt(formData.reach),
        engagement: parseInt(formData.engagement),
        posts: parseInt(formData.posts),
        recordedBy: user.id,
        notes: formData.notes || undefined,
        createdAt: new Date()
      }

      addSocialMediaAnalytics(newEntry)
      navigate("/coordinator/dashboard")
    } catch (error) {
      console.error("Error adding analytics entry:", error)
      alert("Failed to add analytics entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Add New Analytics Entry</h1>
              <p className="text-muted-foreground">Record your social media performance metrics</p>
            </div>

            {/* Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="form-title">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Project *
                    </label>
                    <select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select a project</option>
                      {socialMediaProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Platform *
                    </label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Reach *
                    </label>
                    <input
                      type="number"
                      name="reach"
                      value={formData.reach}
                      onChange={handleChange}
                      placeholder="e.g., 15000"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Engagement *
                    </label>
                    <input
                      type="number"
                      name="engagement"
                      value={formData.engagement}
                      onChange={handleChange}
                      placeholder="e.g., 850"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Posts *
                    </label>
                    <input
                      type="number"
                      name="posts"
                      value={formData.posts}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes or observations..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate("/coordinator/dashboard")}
                    className="btn-outline px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-6 py-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}