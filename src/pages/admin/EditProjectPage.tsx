import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../context/auth-context"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { getProjectById, getUsers } from "../../../lib/mock-data"
import type { Project, User, ProjectStage, ProjectStatus } from "../../../types"

export default function EditProjectPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    googleAnalyticsPropertyId: "",
    googleAnalyticsViewId: "",
    clientId: "",
    webDeveloperId: "",
    socialMediaCoordinatorId: "",
    currentStage: "planning" as ProjectStage,
    status: "active" as ProjectStatus,
    notes: "",
  })

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

    // Only update form data if it's different to avoid unnecessary re-renders
    setFormData(prevData => {
      const newData = {
        name: projectData.name,
        description: projectData.description,
        websiteUrl: projectData.websiteUrl || "",
        googleAnalyticsPropertyId: projectData.googleAnalyticsPropertyId || "",
        googleAnalyticsViewId: projectData.googleAnalyticsViewId || "",
        clientId: projectData.clientId,
        webDeveloperId: projectData.webDeveloperId || "",
        socialMediaCoordinatorId: projectData.socialMediaCoordinatorId || "",
        currentStage: projectData.currentStage,
        status: projectData.status,
        notes: projectData.notes || "",
      }

      // Check if data has actually changed
      return JSON.stringify(prevData) === JSON.stringify(newData) ? prevData : newData
    })

    const allUsers = getUsers()
    setUsers(allUsers)
  }, [isSignedIn, user, projectId, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would update the database
    // For now, we'll just update localStorage
    const projects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...formData,
        webDeveloperId: formData.webDeveloperId || undefined,
        socialMediaCoordinatorId: formData.socialMediaCoordinatorId || undefined,
        updatedAt: new Date(),
      }

      localStorage.setItem("marketing_management_website_projects", JSON.stringify(projects))

      alert("Project updated successfully!")
      navigate("/admin/dashboard")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const clients = users.filter((u) => u.role === "client")
  const developers = users.filter((u) => u.role === "web_developer")
  const coordinators = users.filter((u) => u.role === "social_media_coordinator")

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-primary hover:underline mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold text-foreground mb-2">Edit Project</h1>
              <p className="text-muted-foreground">Update project details and assignments</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">Basic Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Website URL</label>
                      <input
                        type="url"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Assignment */}
                <div className="pt-6 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Team Assignment</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="">Select a client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.fullName} ({client.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Web Developer
                      </label>
                      <select
                        name="webDeveloperId"
                        value={formData.webDeveloperId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="">Not assigned</option>
                        {developers.map((dev) => (
                          <option key={dev.id} value={dev.id}>
                            {dev.fullName} ({dev.email})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Developer will see this project in their dashboard and can work on tickets
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Social Media Coordinator
                      </label>
                      <select
                        name="socialMediaCoordinatorId"
                        value={formData.socialMediaCoordinatorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="">Not assigned</option>
                        {coordinators.map((coord) => (
                          <option key={coord.id} value={coord.id}>
                            {coord.fullName} ({coord.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project Status */}
                <div className="pt-6 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Project Status</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Current Stage <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="currentStage"
                        value={formData.currentStage}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="planning">Planning</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="launch">Launch</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Google Analytics */}
                <div className="pt-6 border-t border-border">
                  <h2 className="text-xl font-bold text-foreground mb-4">Google Analytics</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        GA4 Property ID
                      </label>
                      <input
                        type="text"
                        name="googleAnalyticsPropertyId"
                        value={formData.googleAnalyticsPropertyId}
                        onChange={handleChange}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        View ID (Legacy)
                      </label>
                      <input
                        type="text"
                        name="googleAnalyticsViewId"
                        value={formData.googleAnalyticsViewId}
                        onChange={handleChange}
                        placeholder="123456789"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="pt-6 border-t border-border">
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any additional notes about this project..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#1e2875] to-[#2a3488] text-white rounded-lg font-semibold hover:from-[#2a3488] hover:to-[#1e2875] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}