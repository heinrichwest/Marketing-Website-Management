import { useEffect, useState } from "react"
import React from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getUsers, getProjects, STORAGE_KEYS } from "@/lib/mock-data"
import type { ProjectType, ProjectStage, ProjectStatus, SocialMediaPlatform, ProductType } from "@/types"

export default function NewProjectPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [projectType, setProjectType] = useState<ProjectType>("website")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    webDeveloperId: "",
    socialMediaCoordinatorId: "",
    currentStage: "planning" as ProjectStage,
    status: "active" as ProjectStatus,
    websiteUrl: "",
    brand: "",
    projectDate: "",
    notes: "",
    // Social media specific fields
    socialMediaPlatforms: [] as SocialMediaPlatform[],
    product: "" as ProductType,
    campaignGoals: "",
    targetAudience: "",
    posts: 0,
    likes: 0,
    impressions: 0,
    reach: 0,
    engagement: 0,
  })

  const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaPlatform | "">("")

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const users = getUsers()
  const clients = users.filter((u) => u.role === "client")
  const developers = users.filter((u) => u.role === "web_developer")
  const coordinators = users.filter((u) => u.role === "social_media_coordinator")

  const platforms: SocialMediaPlatform[] = ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube"]



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would make an API call
    const newProject = {
      id: `proj-${Date.now()}`,
      ...formData,
      projectType,
      brand: formData.brand || undefined,
      projectDate: formData.projectDate ? new Date(formData.projectDate) : undefined,
      socialMediaPlatforms: projectType === "social_media" && selectedPlatform ? [selectedPlatform] : undefined,
      product: formData.product || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save the new project
    const currentProjects = getProjects()
    const updatedProjects = [...currentProjects, newProject]
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects))

    // Notify dashboard to refresh
    window.dispatchEvent(new Event('projectsUpdated'))

    alert(`${projectType === "website" ? "Website" : "Social Media"} project "${formData.name}" created successfully!`)
    navigate("/admin/dashboard")
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Create New Project</h1>
            <p className="text-muted-foreground mb-4">Add a new website or social media project to the system</p>
            <Link to="/admin/dashboard" className="btn-outline inline-flex items-center gap-2 hover:border-accent hover:text-accent">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Project Type Selection */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Project Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProjectType("website")}
                 className={`p-6 border-2 rounded-lg transition ${
                  projectType === "website"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent hover:bg-accent/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Website Project</h3>
                    <p className="text-sm text-muted-foreground">Build and maintain a website</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProjectType("social_media")}
                 className={`p-6 border-2 rounded-lg transition ${
                  projectType === "social_media"
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent hover:bg-accent/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Social Media Project</h3>
                    <p className="text-sm text-muted-foreground">Manage social media campaigns</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Project Form */}
          <form onSubmit={handleSubmit} className="card space-y-6">
            <h2 className="text-xl font-bold text-foreground">Project Details</h2>

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-foreground mb-2">
                    Client *
                  </label>
                  <select
                    id="clientId"
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="currentStage" className="block text-sm font-medium text-foreground mb-2">
                    Current Stage *
                  </label>
                  <select
                    id="currentStage"
                    required
                    value={formData.currentStage}
                    onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as ProjectStage })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              </div>
            </div>

            {/* Team Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Team Assignment</h3>

              {projectType === "website" && (
                <div>
                  <label htmlFor="webDeveloperId" className="block text-sm font-medium text-foreground mb-2">
                    Web Developer
                  </label>
                  <select
                    id="webDeveloperId"
                    value={formData.webDeveloperId}
                    onChange={(e) => setFormData({ ...formData, webDeveloperId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a developer (optional)</option>
                    {developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="socialMediaCoordinatorId" className="block text-sm font-medium text-foreground mb-2">
                  Social Media Coordinator {projectType === "social_media" && "*"}
                </label>
                <select
                  id="socialMediaCoordinatorId"
                  required={projectType === "social_media"}
                  value={formData.socialMediaCoordinatorId}
                  onChange={(e) => setFormData({ ...formData, socialMediaCoordinatorId: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a coordinator {projectType === "website" && "(optional)"}</option>
                  {coordinators.map((coord) => (
                    <option key={coord.id} value={coord.id}>
                      {coord.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website Specific Fields */}
            {projectType === "website" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Website Details</h3>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label htmlFor="websiteUrl" className="block text-sm font-medium text-foreground mb-2">
                       Website URL
                     </label>
                     <input
                       type="url"
                       id="websiteUrl"
                       value={formData.websiteUrl}
                       onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       placeholder="https://example.com"
                     />
                   </div>

                   <div>
                     <label htmlFor="brand" className="block text-sm font-medium text-foreground mb-2">
                       Brand
                     </label>
                     <input
                       type="text"
                       id="brand"
                       value={formData.brand}
                       onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       placeholder="Brand name"
                     />
                   </div>

                   <div>
                     <label htmlFor="projectDate" className="block text-sm font-medium text-foreground mb-2">
                       Project Date
                     </label>
                     <input
                       type="date"
                       id="projectDate"
                       value={formData.projectDate}
                       onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                   </div>
                 </div>

               </div>
            )}

            {/* Social Media Specific Fields */}
            {projectType === "social_media" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Social Media Campaign Details</h3>

                 <div>
                   <label htmlFor="platform" className="block text-sm font-medium text-foreground mb-2">
                     Platform *
                   </label>
                   <select
                     id="platform"
                     required
                     value={selectedPlatform}
                     onChange={(e) => setSelectedPlatform(e.target.value as SocialMediaPlatform)}
                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                   >
                     <option value="">Select a platform</option>
                     {platforms.map((platform) => (
                       <option key={platform} value={platform}>
                         {platform}
                       </option>
                     ))}
                   </select>
                 </div>

                <div>
                  <label htmlFor="campaignGoals" className="block text-sm font-medium text-foreground mb-2">
                    Campaign Goals *
                  </label>
                  <textarea
                    id="campaignGoals"
                    required
                    value={formData.campaignGoals}
                    onChange={(e) => setFormData({ ...formData, campaignGoals: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                    placeholder="e.g., Increase brand awareness by 40%, generate 200+ qualified leads"
                  />
                </div>

                 <div>
                   <label htmlFor="targetAudience" className="block text-sm font-medium text-foreground mb-2">
                     Target Audience *
                   </label>
                   <textarea
                     id="targetAudience"
                     required
                     value={formData.targetAudience}
                     onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                     placeholder="e.g., Business owners, HR managers, training coordinators aged 30-55"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label htmlFor="product" className="block text-sm font-medium text-foreground mb-2">
                       Product
                     </label>
                     <select
                       id="product"
                       value={formData.product}
                       onChange={(e) => setFormData({ ...formData, product: e.target.value as ProductType })}
                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                 </div>

                 <div>
                   <h4 className="text-md font-semibold text-foreground mb-3">Initial Metrics</h4>
                   <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                     <div>
                       <label htmlFor="posts" className="block text-sm font-medium text-foreground mb-2">
                         Posts
                       </label>
                       <input
                         type="number"
                         id="posts"
                         min="0"
                         value={formData.posts}
                         onChange={(e) => setFormData({ ...formData, posts: parseInt(e.target.value) || 0 })}
                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                     </div>

                     <div>
                       <label htmlFor="likes" className="block text-sm font-medium text-foreground mb-2">
                         Likes
                       </label>
                       <input
                         type="number"
                         id="likes"
                         min="0"
                         value={formData.likes}
                         onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                     </div>

                     <div>
                       <label htmlFor="impressions" className="block text-sm font-medium text-foreground mb-2">
                         Impressions
                       </label>
                       <input
                         type="number"
                         id="impressions"
                         min="0"
                         value={formData.impressions}
                         onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) || 0 })}
                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                     </div>

                     <div>
                       <label htmlFor="reach" className="block text-sm font-medium text-foreground mb-2">
                         Reach
                       </label>
                       <input
                         type="number"
                         id="reach"
                         min="0"
                         value={formData.reach}
                         onChange={(e) => setFormData({ ...formData, reach: parseInt(e.target.value) || 0 })}
                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                     </div>

                     <div>
                       <label htmlFor="engagement" className="block text-sm font-medium text-foreground mb-2">
                         Engagement
                       </label>
                       <input
                         type="number"
                         id="engagement"
                         min="0"
                         value={formData.engagement}
                         onChange={(e) => setFormData({ ...formData, engagement: parseInt(e.target.value) || 0 })}
                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                       />
                     </div>
                   </div>
                 </div>
               </div>
             )}

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                placeholder="Additional notes or requirements"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary flex-1 hover:shadow-accent/20">
                Create {projectType === "website" ? "Website" : "Social Media"} Project
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline flex-1 hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}
