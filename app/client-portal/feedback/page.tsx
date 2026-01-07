"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId } from "@/lib/mock-data"
import type { Project } from "@/types"
import { Link } from "react-router-dom"

export default function ClientFeedbackPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [feedback, setFeedback] = useState({
    rating: 5,
    category: "overall",
    comment: "",
    isPublic: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user && user.role === "client") {
      const userProjects = getProjectsByUserId(user.id, user.role)
      setProjects(userProjects)
      if (userProjects.length > 0) {
        setSelectedProject(userProjects[0].id)
      }
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProject || !feedback.comment.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log("Submitting feedback:", {
      clientId: user?.id,
      projectId: selectedProject,
      ...feedback
    })

    // Reset form
    setFeedback({
      rating: 5,
      category: "overall",
      comment: "",
      isPublic: false
    })

    setIsSubmitting(false)
    alert("Thank you for your feedback! We'll review it and get back to you soon.")
  }

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/client-portal/dashboard" className="flex items-center gap-3">
              <img src="/Logo.png" alt="Logo" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-primary">Client Portal</h1>
                <p className="text-sm text-muted-foreground">Submit Feedback</p>
              </div>
            </Link>

            <Link
              to="/client-portal/dashboard"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Share Your Feedback</h2>
            <p className="text-muted-foreground">Help us improve by sharing your thoughts about our work</p>
          </div>

          {/* Feedback Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Which project is this feedback about?
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  How would you rate our work?
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 ${
                          star <= feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {ratingLabels[feedback.rating as keyof typeof ratingLabels]}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What area does this feedback relate to?
                </label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="overall">Overall Experience</option>
                  <option value="design">Design Quality</option>
                  <option value="functionality">Website Functionality</option>
                  <option value="communication">Team Communication</option>
                  <option value="timeline">Project Timeline</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Please share your detailed feedback, suggestions for improvement, or any concerns..."
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your feedback helps us improve our services. Be as specific as possible.
                </p>
              </div>

              {/* Public/Private Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={feedback.isPublic}
                  onChange={(e) => setFeedback(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="isPublic" className="text-sm text-foreground">
                  Make this feedback public (visible to other clients as testimonials)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting Feedback...
                  </div>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          </div>

          {/* Feedback Tips */}
          <div className="bg-secondary/10 dark:bg-secondary/20 rounded-xl border border-secondary/20 dark:border-secondary/30 p-6 mt-8">
            <h3 className="text-lg font-semibold text-primary dark:text-primary mb-3">
              💡 Tips for Better Feedback
            </h3>
            <ul className="space-y-2 text-sm text-primary dark:text-primary">
              <li>• Be specific about what you liked or didn't like</li>
              <li>• Include examples from your experience</li>
              <li>• Suggest improvements when possible</li>
              <li>• Mention both positive aspects and areas for growth</li>
              <li>• Rate based on your overall satisfaction with the work</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}