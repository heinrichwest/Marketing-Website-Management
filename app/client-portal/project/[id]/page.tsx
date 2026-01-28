"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjectById, getTicketsByProjectId, getMessagesByUserId } from "@/lib/mock-data"
import { getStatusColor } from "@/lib/utils"
import type { Project, Ticket, Message } from "@/types"
import { format } from "date-fns"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ClientPortalProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login?portal=client")
      return
    }

    if (!id) {
      navigate("/client-portal/dashboard")
      return
    }

    const projectData = getProjectById(id)
    if (!projectData || projectData.clientId !== user.id) {
      navigate("/client-portal/dashboard")
      return
    }

    setProject(projectData)
    setTickets(getTicketsByProjectId(id))
    setMessages(getMessagesByUserId(user.id).filter(msg => msg.projectId === id))
    setIsLoading(false)
  }, [user, id, navigate])

const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      planning: "bg-primary/10 text-primary",
      development: "bg-accent/10 text-accent",
      testing: "bg-warning/10 text-warning",
      completed: "bg-success/10 text-success"
    }
    return colors[stage] || "bg-gray-100 text-gray-800"
  }

  if (!user || user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container mx-auto px-6 py-8">
{/* Project Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate("/client-portal/dashboard")}
                className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStageColor(project.currentStage)}`}>
                    {project.currentStage}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Updated {format(project.updatedAt, "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/messages" className="btn-outline px-4 py-2">
                Message Team
              </Link>
              <Link to="/client-portal/files" className="btn-outline px-4 py-2">
                Share Files
              </Link>
              <Link to="/client-portal/feedback" className="btn-primary px-4 py-2">
                Submit Feedback
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Project Progress</h3>

              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-foreground">
                      {project.currentStage === 'planning' && '25%'}
                      {project.currentStage === 'design' && '40%'}
                      {project.currentStage === 'development' && '60%'}
                      {project.currentStage === 'testing' && '80%'}
                      {project.currentStage === 'launch' && '100%'}
                      {project.currentStage === 'maintenance' && '100%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: project.currentStage === 'planning' ? '25%' :
                               project.currentStage === 'design' ? '40%' :
                               project.currentStage === 'development' ? '60%' :
                               project.currentStage === 'testing' ? '80%' :
                               project.currentStage === 'launch' ? '100%' : '100%'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground capitalize">{project.projectType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="text-foreground">{format(project.createdAt, "MMM dd, yyyy")}</span>
                      </div>
                      {project.launchDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Launch Date:</span>
                          <span className="text-foreground">{format(project.launchDate, "MMM dd, yyyy")}</span>
                        </div>
                      )}
                      {project.websiteUrl && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Website:</span>
                          <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View Site
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Team Members</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Developer:</span>
                        <span className="text-foreground">{project.webDeveloperId ? "Assigned" : "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinator:</span>
                        <span className="text-foreground">{project.socialMediaCoordinatorId ? "Assigned" : "Not assigned"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Recent Updates</h3>

              <div className="space-y-4">
                {tickets.length > 0 ? (
                  tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-4 p-4 border border-border/50 rounded-lg">
                      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className={`px-2 py-1 rounded-full ${
                            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span>{format(ticket.createdAt, "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-muted-foreground">No updates yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/messages" className="block w-full btn-outline text-center py-2">
                  Message Team
                </Link>
                <Link to="/client-portal/files" className="block w-full btn-outline text-center py-2">
                  Share Files
                </Link>
                <Link to="/client-portal/feedback" className="block w-full btn-primary text-center py-2">
                  Submit Feedback
                </Link>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tickets:</span>
                  <span className="text-sm font-medium text-foreground">{tickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Open Tickets:</span>
                  <span className="text-sm font-medium text-foreground">
                    {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Messages:</span>
                  <span className="text-sm font-medium text-foreground">{messages.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </>
  )
}