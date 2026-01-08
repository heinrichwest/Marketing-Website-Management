import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../../../../components/navbar"
import Footer from "../../../../components/footer"
import { useAuth } from "../../../../context/auth-context"
import { getProjectsByUserId, getUsers, addTicket } from "../../../../lib/mock-data"
import type { TicketPriority, TicketType } from "../../../../types"

export default function ClientNewTicketPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TicketPriority>("medium")
  const [type, setType] = useState<TicketType>("feature_request")
  const [projectId, setProjectId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "client") {
      navigate("/dashboard")
    }

    // Check for project parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    const projectParam = urlParams.get('project')
    if (projectParam) {
      setProjectId(projectParam)
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const myProjects = getProjectsByUserId(user.id, user.role)
  const allUsers = getUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newTicket = {
      id: `ticket-${Date.now()}`,
      projectId,
      createdBy: user.id,
      title,
      description,
      type,
      priority,
      status: "open" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save the ticket to localStorage
    addTicket(newTicket)



    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setType("feature_request")
    setProjectId("")

    setIsSubmitting(false)

    // Navigate back to dashboard
    navigate("/client/dashboard")
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12 max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Create New Ticket</h1>
                <p className="text-muted-foreground">Submit a request for your project team</p>
              </div>
              <Link to="/client/dashboard" className="btn-outline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Select Project *
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Choose a project...</option>
                  {myProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ticket Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Ticket Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TicketType)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="content_change">Content Change</option>
                  <option value="design_update">Design Update</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the request"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of what you need..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-vertical"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !projectId}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </button>
                <Link to="/client/dashboard" className="btn-outline">
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <h3 className="text-sm font-semibold text-primary mb-2">💡 Ticket Guidelines</h3>
            <ul className="text-xs text-primary/80 space-y-1">
              <li>• Be specific about what you need</li>
              <li>• Include any relevant details or examples</li>
              <li>• Choose the appropriate priority level</li>
              <li>• Your assigned developer will respond within 24 hours</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}