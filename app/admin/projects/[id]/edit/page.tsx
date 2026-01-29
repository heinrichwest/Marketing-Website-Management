import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getProjectById, getUsers } from "@/lib/mock-data"
import { getFirestoreProjectById, updateFirestoreProject, getFirestoreUsers } from "@/lib/firestore-service"
import type { Project, User, ProjectStage, ProjectStatus, SocialMediaPlatform } from "@/types"

// Check if using Firebase (not mock auth)
const useFirebase = () => localStorage.getItem('useMockAuth') === 'false'

export default function EditProjectPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    websiteUrl: string;
    clientId: string;
    webDeveloperId: string;
    socialMediaCoordinatorId: string;
    currentStage: ProjectStage;
    status: ProjectStatus;
    notes: string;
    projectDate: string;
    product: string;
    socialMediaPlatforms: SocialMediaPlatform[];
    posts: number;
    likes: number;
    impressions: number;
    reach: number;
    engagement: number;
  }>({
    name: "",
    description: "",
    websiteUrl: "",
    clientId: "",
    webDeveloperId: "",
    socialMediaCoordinatorId: "",
    currentStage: "planning" as ProjectStage,
    status: "active" as ProjectStatus,
    notes: "",
    projectDate: "",
    product: "",
    socialMediaPlatforms: [],
    posts: 0,
    likes: 0,
    impressions: 0,
    reach: 0,
    engagement: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Load project data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        let projectData: Project | null | undefined = null
        let allUsers: User[] = []

        if (useFirebase()) {
          // Load from Firestore
          projectData = await getFirestoreProjectById(projectId)
          allUsers = await getFirestoreUsers()
        } else {
          // Load from localStorage (mock)
          projectData = getProjectById(projectId)
          allUsers = getUsers()
        }

        if (projectData) {
          setProject(projectData)
          setFormData({
            name: projectData.name,
            description: projectData.description,
            websiteUrl: projectData.websiteUrl || "",
            clientId: projectData.clientId,
            webDeveloperId: projectData.webDeveloperId || "",
            socialMediaCoordinatorId: projectData.socialMediaCoordinatorId || "",
            currentStage: projectData.currentStage,
            status: projectData.status,
            notes: projectData.notes || "",
            projectDate: projectData.projectDate ? new Date(projectData.projectDate).toISOString().split('T')[0] : "",
            product: projectData.product || "",
            socialMediaPlatforms: projectData.socialMediaPlatforms || [],
            posts: projectData.posts || 0,
            likes: projectData.likes || 0,
            impressions: projectData.impressions || 0,
            reach: projectData.reach || 0,
            engagement: projectData.engagement || 0,
          })
        }

        setUsers(allUsers)
      } catch (error) {
        console.error("Error loading project data:", error)
        setSaveError("Failed to load project data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [projectId])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    if (!project) {
      // Project loading is handled in the first useEffect
      return
    }
  }, [isSignedIn, user, projectId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      // Build the update object
      const updates: Partial<Project> = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl || undefined,
        clientId: formData.clientId,
        webDeveloperId: formData.webDeveloperId || undefined,
        currentStage: formData.currentStage,
        status: formData.status,
        notes: formData.notes || undefined,
        projectDate: formData.projectDate ? new Date(formData.projectDate) : project?.projectDate,
        product: formData.product as any || undefined,
      }

      // Add social media fields for social media projects
      if (project?.projectType === "social_media") {
        updates.socialMediaCoordinatorId = formData.socialMediaCoordinatorId || undefined
        updates.socialMediaPlatforms = formData.socialMediaPlatforms
        updates.posts = Number(formData.posts)
        updates.likes = Number(formData.likes)
        updates.impressions = Number(formData.impressions)
        updates.reach = Number(formData.reach)
        updates.engagement = Number(formData.engagement)
      }

      if (useFirebase()) {
        // Update in Firestore
        const updatedProject = await updateFirestoreProject(projectId, updates)

        if (!updatedProject) {
          setSaveError("Project not found in database!")
          return
        }

        // Update local state
        setProject(updatedProject)
        alert("Project updated successfully!")
      } else {
        // Update in localStorage (mock)
        const projects = JSON.parse(localStorage.getItem("marketing_management_website_projects") || "[]")
        const projectIndex = projects.findIndex((p: Project) => p.id === projectId)

        if (projectIndex === -1) {
          setSaveError("Project not found!")
          return
        }

        // Create updated project preserving all original fields
        const updatedProject = {
          ...projects[projectIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
          projectDate: formData.projectDate ? new Date(formData.projectDate).toISOString() : projects[projectIndex].projectDate,
        }

        // Update the project in the array
        projects[projectIndex] = updatedProject

        // Save back to localStorage
        localStorage.setItem("marketing_management_website_projects", JSON.stringify(projects))

        // Update the local project state
        setProject(updatedProject)
        alert("Project updated successfully!")
      }

      console.log("Project updated successfully")
    } catch (error) {
      console.error("Error updating project:", error)
      setSaveError("Failed to update project. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted">
          <div className="container py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-2">Project Not Found</h2>
                <p className="text-red-600 mb-4">
                  The project you are looking for does not exist or could not be loaded.
                </p>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
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
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Project Date
                      </label>
                      <input
                        type="date"
                        name="projectDate"
                        value={formData.projectDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The date of the project (defaults to creation date if not set)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Product
                      </label>
                      <select
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="">Select a product</option>
                        <option value="Learnerships">Learnerships</option>
                        <option value="Academy">Academy</option>
                        <option value="Employment Equity">Employment Equity</option>
                        <option value="Venueideas">Venueideas</option>
                        <option value="Trouidees">Trouidees</option>
                        <option value="TAP">TAP</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select the product type for this project
                      </p>
                    </div>

                    {project.projectType === "website" && (
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
                    )}
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

                     {project.projectType === "social_media" && (
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
                     )}
                  </div>
                </div>

                {/* Social Media Platforms & Metrics - Only for social_media projects */}
                {project.projectType === "social_media" && (
                  <div className="pt-6 border-t border-border">
                    <h2 className="text-xl font-bold text-foreground mb-4">Social Media Platforms</h2>
                    <div className="space-y-4">
                       <div>
                         <label htmlFor="platform" className="block text-sm font-medium text-foreground mb-3">
                           Select Platform
                         </label>
                         <select
                           id="platform"
                           value={(formData.socialMediaPlatforms as string[])[0] || ""}
                           onChange={(e) => {
                             const selectedPlatform = e.target.value as SocialMediaPlatform;
                             setFormData(prev => ({
                               ...prev,
                               socialMediaPlatforms: selectedPlatform ? [selectedPlatform] : []
                             }));
                           }}
                           className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                         >
                           <option value="">Select a platform</option>
                            {[...new Set(["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Snapchat"])].map((platform) => (
                             <option key={platform} value={platform}>
                               {platform}
                             </option>
                           ))}
                          </select>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Social Media Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Posts
                            </label>
                            <input
                              type="number"
                              name="posts"
                              value={formData.posts}
                              onChange={handleChange}
                              min="0"
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Likes
                            </label>
                            <input
                              type="number"
                              name="likes"
                              value={formData.likes}
                              onChange={handleChange}
                              min="0"
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Impressions
                            </label>
                            <input
                              type="number"
                              name="impressions"
                              value={formData.impressions}
                              onChange={handleChange}
                              min="0"
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Reach
                            </label>
                            <input
                              type="number"
                              name="reach"
                              value={formData.reach}
                              onChange={handleChange}
                              min="0"
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Engagement
                            </label>
                            <input
                              type="number"
                              name="engagement"
                              value={formData.engagement}
                              onChange={handleChange}
                              min="0"
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                        <option value="seo_optimization">SEO Optimisation</option>
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

                {/* Error Message */}
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{saveError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-[#1e2875] to-[#2a3488] text-white rounded-lg font-semibold hover:from-[#2a3488] hover:to-[#1e2875] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                    className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition disabled:opacity-50"
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
