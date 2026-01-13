"use client"

import React from "react"
import { useState, useEffect } from "react"
import { updateProject, getUsers } from "@/lib/mock-data"
import type { Project, User, ProjectStage, ProjectStatus } from "@/types"

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
    if (isOpen && project) {
      const allUsers = getUsers()
      setUsers(allUsers)
      setFormData(prevData => ({
        ...prevData,
        name: project.name,
        description: project.description,
        websiteUrl: project.websiteUrl || "",
        googleAnalyticsPropertyId: project.googleAnalyticsPropertyId || "",
        googleAnalyticsViewId: project.googleAnalyticsViewId || "",
        clientId: project.clientId,
        webDeveloperId: project.webDeveloperId || "",
        socialMediaCoordinatorId: project.socialMediaCoordinatorId || "",
        currentStage: project.currentStage,
        status: project.status,
        notes: project.notes || "",
      }))
    }
  }, [isOpen, project])

  if (!isOpen || !project) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updated = updateProject(project.id, {
      name: formData.name,
      description: formData.description,
      websiteUrl: formData.websiteUrl,
      googleAnalyticsPropertyId: formData.googleAnalyticsPropertyId,
      googleAnalyticsViewId: formData.googleAnalyticsViewId,
      clientId: formData.clientId,
      webDeveloperId: formData.webDeveloperId || undefined,
      socialMediaCoordinatorId: formData.socialMediaCoordinatorId || undefined,
      currentStage: formData.currentStage,
      status: formData.status,
      notes: formData.notes,
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

            {/* Website URL */}
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

            {/* Social Media Coordinator */}
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

            {/* Google Analytics Property ID */}
            <div>
              <label htmlFor="googleAnalyticsPropertyId" className="block text-sm font-medium text-foreground mb-2">
                Google Analytics Property ID
              </label>
              <input
                type="text"
                id="googleAnalyticsPropertyId"
                name="googleAnalyticsPropertyId"
                value={formData.googleAnalyticsPropertyId}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            {/* Google Analytics View ID */}
            <div>
              <label htmlFor="googleAnalyticsViewId" className="block text-sm font-medium text-foreground mb-2">
                Google Analytics View ID
              </label>
              <input
                type="text"
                id="googleAnalyticsViewId"
                name="googleAnalyticsViewId"
                value={formData.googleAnalyticsViewId}
                onChange={handleChange}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                placeholder="123456789"
              />
            </div>

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
