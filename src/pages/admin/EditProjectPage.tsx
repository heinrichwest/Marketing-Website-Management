import { useEffect, useState } from "react"
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../context/auth-context"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { getFirebaseProjectById, updateFirebaseProject } from "../../../lib/firebase-data"
import { getUsers } from "../../../lib/mock-data"
import type { Project, User, ProjectStage, ProjectStatus, SocialMediaPlatform, ProductType } from "../../../types"

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
    brand: "",
    projectDate: "",
    clientId: "",
    webDeveloperId: "",
    socialMediaCoordinatorId: "",
    currentStage: "planning" as ProjectStage,
    status: "active" as ProjectStatus,
    notes: "",
    // Social media specific fields
    socialMediaPlatform: "",
    product: "" as ProductType,
    campaignGoals: "",
    targetAudience: "",
    posts: 0,
    likes: 0,
    impressions: 0,
    reach: 0,
    engagement: 0,
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

    const fetchProject = async () => {
      const projectData = await getFirebaseProjectById(projectId)
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
          brand: projectData.brand || "",
          projectDate: projectData.projectDate ? projectData.projectDate.toISOString().split('T')[0] : "",
          clientId: projectData.clientId,
          webDeveloperId: projectData.webDeveloperId || "",
          socialMediaCoordinatorId: projectData.socialMediaCoordinatorId || "",
          currentStage: projectData.currentStage,
          status: projectData.status,
          notes: projectData.notes || "",
          // Social media fields
          socialMediaPlatform: projectData.socialMediaPlatforms?.[0] || "",
          product: projectData.product as ProductType,
          campaignGoals: projectData.campaignGoals || "",
          targetAudience: projectData.targetAudience || "",
          posts: projectData.posts || 0,
          likes: projectData.likes || 0,
          impressions: projectData.impressions || 0,
          reach: projectData.reach || 0,
          engagement: projectData.engagement || 0,
        }

        // Check if data has actually changed
        const hasChanged = JSON.stringify(prevData) !== JSON.stringify(newData)
        return hasChanged ? newData : prevData
      })

      const allUsers = getUsers()
      setUsers(allUsers)
    }

    fetchProject()
  }, [isSignedIn, user, projectId, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const updates = {
        ...formData,
        brand: formData.brand || undefined,
        projectDate: formData.projectDate ? new Date(formData.projectDate) : undefined,
        webDeveloperId: formData.webDeveloperId || undefined,
        socialMediaCoordinatorId: formData.socialMediaCoordinatorId || undefined,
        product: formData.product || undefined,
        socialMediaPlatforms: formData.socialMediaPlatform ? [formData.socialMediaPlatform as SocialMediaPlatform] : undefined,
      }

      const updatedProject = await updateFirebaseProject(projectId, updates)

      if (updatedProject) {
        alert("Project updated successfully!")
        navigate("/admin/dashboard")
      } else {
        alert("Failed to update project. Please try again.")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      alert("An error occurred while updating the project. Please try again.")
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

                 {/* Project Details */}
                 <div className="pt-6 border-t border-border">
                   <h2 className="text-xl font-bold text-foreground mb-4">Project Details</h2>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-foreground mb-2">
                         Brand
                       </label>
                       <input
                         type="text"
                         name="brand"
                         value={formData.brand}
                         onChange={handleChange}
                         placeholder="Brand name"
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

                 {/* Social Media Details */}
                 <div className="pt-6 border-t border-border">
                   <h2 className="text-xl font-bold text-foreground mb-4">Social Media Details</h2>

                   <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <option value="">Select Product</option>
                            <option value="Learnerships">Learnerships</option>
                            <option value="Academy">Academy</option>
                            <option value="Employment Equity">Employment Equity</option>
                            <option value="Venueideas">Venueideas</option>
                            <option value="Trouidees">Trouidees</option>
                            <option value="TAP">TAP</option>
                         </select>
                       </div>

                       <div>
                          <label htmlFor="platform" className="block text-sm font-medium text-foreground mb-2">
                            Platform
                          </label>
                          <select
                            id="platform"
                            value={formData.socialMediaPlatform}
                            onChange={(e) => {
                              const selectedPlatform = e.target.value as SocialMediaPlatform;
                              setFormData(prev => ({
                                ...prev,
                                socialMediaPlatform: selectedPlatform
                              }));
                            }}
                            className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                          >
                            <option value="">Select a platform</option>
                            {(["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Snapchat"] as SocialMediaPlatform[]).map((platform) => (
                              <option key={platform} value={platform}>
                                {platform}
                              </option>
                            ))}
                          </select>
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-foreground mb-2">
                         Campaign Goals
                       </label>
                       <textarea
                         name="campaignGoals"
                         value={formData.campaignGoals}
                         onChange={handleChange}
                         rows={3}
                         className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                         placeholder="Describe the main goals of this social media campaign..."
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-foreground mb-2">
                         Target Audience
                       </label>
                       <input
                         type="text"
                         name="targetAudience"
                         value={formData.targetAudience}
                         onChange={handleChange}
                         className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                         placeholder="Describe the target audience (age, interests, demographics, etc.)"
                       />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/80 hover:shadow-accent/20 transition"
                  >
                    Save Changes
                  </button>
                   <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-accent/10 hover:border-accent hover:text-accent transition"
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