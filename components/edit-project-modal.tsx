"use client"

import React from "react"
import { useState, useEffect } from "react"
import { updateProject, getUsers } from "@/lib/mock-data"
import type { Project, User, ProjectStage, ProjectStatus, SocialMediaPlatform, ProductType } from "@/types"

interface EditProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditProjectModal({ project, isOpen, onClose, onSuccess }: EditProjectModalProps) {
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
    socialMediaPlatforms: [] as SocialMediaPlatform[],
    product: "" as ProductType | "",
    campaignGoals: "",
    targetAudience: "",
    posts: 0,
    likes: 0,
    impressions: 0,
    reach: 0,
    engagement: 0,
  })

  useEffect(() => {
    if (isOpen && project) {
      const allUsers = getUsers()
      setUsers(allUsers)
      setFormData(prevData => ({
        ...prevData,
        name: project.name,
        description: project.description,
        websiteUrl: project.websiteUrl || "",
        brand: project.brand || "",
        projectDate: project.projectDate ? project.projectDate.toISOString().split('T')[0] : "",
        clientId: project.clientId,
        webDeveloperId: project.webDeveloperId || "",
        socialMediaCoordinatorId: project.socialMediaCoordinatorId || "",
        currentStage: project.currentStage,
        status: project.status,
        notes: project.notes || "",
        // Social media fields
        socialMediaPlatforms: project.socialMediaPlatforms || [],
        product: project.product || "",
        campaignGoals: project.campaignGoals || "",
        targetAudience: project.targetAudience || "",
        posts: project.posts || 0,
        likes: project.likes || 0,
        impressions: project.impressions || 0,
        reach: project.reach || 0,
        engagement: project.engagement || 0,
      }))
    }
  }, [isOpen, project])

  if (!isOpen || !project) return null

  const isWebsiteProject = project.projectType === "website"
  const isSocialMediaProject = project.projectType === "social_media"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updated = updateProject(project.id, {
      name: formData.name,
      description: formData.description,
      websiteUrl: formData.websiteUrl,
      brand: formData.brand || undefined,
      projectDate: formData.projectDate ? new Date(formData.projectDate) : undefined,
      clientId: formData.clientId,
      webDeveloperId: formData.webDeveloperId || undefined,
      socialMediaCoordinatorId: formData.socialMediaCoordinatorId || undefined,
      currentStage: formData.currentStage,
      status: formData.status,
      notes: formData.notes,
      // Social media fields
      socialMediaPlatforms: formData.socialMediaPlatforms,
      product: formData.product || undefined,
      campaignGoals: formData.campaignGoals,
      targetAudience: formData.targetAudience,
      posts: formData.posts,
      likes: formData.likes,
      impressions: formData.impressions,
      reach: formData.reach,
      engagement: formData.engagement,
    })

    if (updated) {
      onSuccess()
      onClose()
    } else {
      alert("Failed to update project")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const clients = users.filter((u) => u.role === "client")
  const developers = users.filter((u) => u.role === "web_developer")
  const coordinators = users.filter((u) => u.role === "social_media_coordinator")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="edit-project-title">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 id="edit-project-title" className="text-2xl font-bold text-foreground">Edit Project: {project.name}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
              />
            </div>

             {/* Website URL - Only for website projects */}
             {isWebsiteProject && (
               <div className="md:col-span-2">
                 <label htmlFor="websiteUrl" className="block text-sm font-medium text-foreground mb-2">
                   Website URL
                 </label>
                 <input
                   type="url"
                   id="websiteUrl"
                   name="websiteUrl"
                   value={formData.websiteUrl}
                   onChange={handleChange}
                   className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   placeholder="https://example.com"
                 />
               </div>
             )}

             {/* Brand */}
             <div>
               <label htmlFor="brand" className="block text-sm font-medium text-foreground mb-2">
                 Brand
               </label>
               <input
                 type="text"
                 id="brand"
                 name="brand"
                 value={formData.brand}
                 onChange={handleChange}
                 className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                 placeholder="Brand name"
               />
             </div>

             {/* Project Date */}
             <div>
               <label htmlFor="projectDate" className="block text-sm font-medium text-foreground mb-2">
                 Project Date
               </label>
               <input
                 type="date"
                 id="projectDate"
                 name="projectDate"
                 value={formData.projectDate}
                 onChange={handleChange}
                 className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
               />
             </div>

            {/* Client */}
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-foreground mb-2">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Web Developer */}
            <div>
              <label htmlFor="webDeveloperId" className="block text-sm font-medium text-foreground mb-2">
                Web Developer
              </label>
              <select
                id="webDeveloperId"
                name="webDeveloperId"
                value={formData.webDeveloperId}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
              >
                <option value="">Not Assigned</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.fullName}
                  </option>
                ))}
              </select>
            </div>

             {/* Social Media Coordinator - Only for social media projects */}
             {isSocialMediaProject && (
               <div>
                 <label htmlFor="socialMediaCoordinatorId" className="block text-sm font-medium text-foreground mb-2">
                   Social Media Coordinator
                 </label>
                 <select
                   id="socialMediaCoordinatorId"
                   name="socialMediaCoordinatorId"
                   value={formData.socialMediaCoordinatorId}
                   onChange={handleChange}
                   className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                 >
                   <option value="">Not Assigned</option>
                   {coordinators.map((coord) => (
                     <option key={coord.id} value={coord.id}>
                       {coord.fullName}
                     </option>
                   ))}
                 </select>
               </div>
             )}

            {/* Current Stage */}
            <div>
              <label htmlFor="currentStage" className="block text-sm font-medium text-foreground mb-2">
                Current Stage
              </label>
              <select
                id="currentStage"
                name="currentStage"
                value={formData.currentStage}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
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

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>



             {/* Social Media Platforms - Only for social media projects */}
             {isSocialMediaProject && (
               <div className="md:col-span-2">
                 <label htmlFor="platform" className="block text-sm font-medium text-foreground mb-2">
                   Social Media Platform
                 </label>
                 <select
                   id="platform"
                   value={formData.socialMediaPlatforms[0] || ""}
                   onChange={(e) => {
                     const selectedPlatform = e.target.value as SocialMediaPlatform;
                     setFormData(prev => ({
                       ...prev,
                       socialMediaPlatforms: selectedPlatform ? [selectedPlatform] : []
                     }));
                   }}
                   className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                 >
                   <option value="">Select a platform</option>
                   {([...new Set(["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Snapchat"])] as SocialMediaPlatform[]).map((platform) => (
                     <option key={platform} value={platform}>
                       {platform}
                     </option>
                   ))}
                 </select>
               </div>
             )}

            {/* Product - Only for social media projects */}
            {isSocialMediaProject && (
              <div className="md:col-span-2">
                <label htmlFor="product" className="block text-sm font-medium text-foreground mb-2">
                  Product
                </label>
                <select
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
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
            )}

            {/* Campaign Goals - Only for social media projects */}
            {isSocialMediaProject && (
              <div className="md:col-span-2">
                <label htmlFor="campaignGoals" className="block text-sm font-medium text-foreground mb-2">
                  Campaign Goals
                </label>
                <textarea
                  id="campaignGoals"
                  name="campaignGoals"
                  value={formData.campaignGoals}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  placeholder="Describe the main goals of this social media campaign..."
                />
              </div>
            )}

             {/* Target Audience - Only for social media projects */}
             {isSocialMediaProject && (
               <div className="md:col-span-2">
                 <label htmlFor="targetAudience" className="block text-sm font-medium text-foreground mb-2">
                   Target Audience
                 </label>
                 <input
                   type="text"
                   id="targetAudience"
                   name="targetAudience"
                   value={formData.targetAudience}
                   onChange={handleChange}
                   className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   placeholder="Describe the target audience (age, interests, demographics, etc.)"
                 />
               </div>
             )}

             {/* Social Media Metrics - Only for social media projects */}
             {isSocialMediaProject && (
               <>
                 <div>
                   <label htmlFor="posts" className="block text-sm font-medium text-foreground mb-2">
                     Posts
                   </label>
                   <input
                     type="number"
                     id="posts"
                     name="posts"
                     value={formData.posts}
                     onChange={handleChange}
                     min="0"
                     className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   />
                 </div>

                 <div>
                   <label htmlFor="likes" className="block text-sm font-medium text-foreground mb-2">
                     Likes
                   </label>
                   <input
                     type="number"
                     id="likes"
                     name="likes"
                     value={formData.likes}
                     onChange={handleChange}
                     min="0"
                     className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   />
                 </div>

                 <div>
                   <label htmlFor="impressions" className="block text-sm font-medium text-foreground mb-2">
                     Impressions
                   </label>
                   <input
                     type="number"
                     id="impressions"
                     name="impressions"
                     value={formData.impressions}
                     onChange={handleChange}
                     min="0"
                     className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   />
                 </div>

                 <div>
                   <label htmlFor="reach" className="block text-sm font-medium text-foreground mb-2">
                     Reach
                   </label>
                   <input
                     type="number"
                     id="reach"
                     name="reach"
                     value={formData.reach}
                     onChange={handleChange}
                     min="0"
                     className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   />
                 </div>

                 <div>
                   <label htmlFor="engagement" className="block text-sm font-medium text-foreground mb-2">
                     Engagement
                   </label>
                   <input
                     type="number"
                     id="engagement"
                     name="engagement"
                     value={formData.engagement}
                     onChange={handleChange}
                     min="0"
                     className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                   />
                 </div>
               </>
             )}

            {/* Social Media Metrics - Only for social media projects */}
            {isSocialMediaProject && (
              <>
                <div>
                  <label htmlFor="posts" className="block text-sm font-medium text-foreground mb-2">
                    Posts
                  </label>
                  <input
                    type="number"
                    id="posts"
                    name="posts"
                    value={formData.posts}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="likes" className="block text-sm font-medium text-foreground mb-2">
                    Likes
                  </label>
                  <input
                    type="number"
                    id="likes"
                    name="likes"
                    value={formData.likes}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="impressions" className="block text-sm font-medium text-foreground mb-2">
                    Impressions
                  </label>
                  <input
                    type="number"
                    id="impressions"
                    name="impressions"
                    value={formData.impressions}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="reach" className="block text-sm font-medium text-foreground mb-2">
                    Reach
                  </label>
                  <input
                    type="number"
                    id="reach"
                    name="reach"
                    value={formData.reach}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="engagement" className="block text-sm font-medium text-foreground mb-2">
                    Engagement
                  </label>
                  <input
                    type="number"
                    id="engagement"
                    name="engagement"
                    value={formData.engagement}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                placeholder="Additional project notes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
