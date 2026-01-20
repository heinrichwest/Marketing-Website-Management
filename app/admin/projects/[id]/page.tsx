"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectById, getUsers, getTicketsByProjectId } from "@/lib/mock-data"
import { getStageDisplayName, formatRelativeTime } from "@/lib/utils"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import type { Project, User, Ticket } from "@/types"

export default function ViewProjectPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.id as string

  // Get data synchronously - avoid setState in effects
  const projectData = projectId ? getProjectById(projectId) : null
  const users = getUsers()
  const projectTickets = projectId ? getTicketsByProjectId(projectId) : []

  const [isLoading, setIsLoading] = useState(!projectData)
  const [project, setProject] = useState<Project | null>(projectData || null)
  const [client, setClient] = useState<User | null>(
    projectData ? users.find((u) => u.id === projectData.clientId) || null : null
  )
  const [developer, setDeveloper] = useState<User | null>(
    projectData ? users.find((u) => u.id === projectData.webDeveloperId) || null : null
  )
  const [coordinator, setCoordinator] = useState<User | null>(
    projectData ? users.find((u) => u.id === projectData.socialMediaCoordinatorId) || null : null
  )
  const [tickets, setTickets] = useState<Ticket[]>(projectTickets)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  useEffect(() => {
    if (!projectData) {
      navigate("/admin/dashboard")
    }
  }, [projectData, navigate])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading || !project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    )
  }

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === "open").length,
    inProgressTickets: tickets.filter((t) => t.status === "in_progress").length,
    resolvedTickets: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/admin/dashboard"
                className="text-primary hover:text-primary/80 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold text-foreground">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={`/admin/projects/${projectId}/edit`}
                className="btn-primary"
              >
                Edit Project
              </Link>
              <Link
                to={`/admin/analytics/${projectId}`}
                className="btn-outline"
              >
                View Analytics
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Information */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Project Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Project Type</div>
                    <div className="text-foreground capitalize">{project.projectType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-foreground">{project.description}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Stage</div>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {getStageDisplayName(project.currentStage)}
                    </span>
                  </div>
                  {project.websiteUrl && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Website URL</div>
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {project.websiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Team</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Client</div>
                    {client ? (
                      <div>
                        <div className="font-medium text-foreground">{client.fullName}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Not assigned</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Web Developer</div>
                    {developer ? (
                      <div>
                        <div className="font-medium text-foreground">{developer.fullName}</div>
                        <div className="text-sm text-muted-foreground">{developer.email}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Not assigned</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Social Media Coordinator</div>
                    {coordinator ? (
                      <div>
                        <div className="font-medium text-foreground">{coordinator.fullName}</div>
                        <div className="text-sm text-muted-foreground">{coordinator.email}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Not assigned</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Analytics Info */}
              {project.projectType === "website" && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">Analytics</h2>
                  <div className="space-y-4">

                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Created</div>
                    <div className="text-foreground">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  {project.launchDate && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Launch Date</div>
                      <div className="text-foreground">
                        {new Date(project.launchDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                    <div className="text-foreground">
                      {formatRelativeTime(project.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets and Notes */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ticket Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.totalTickets}</div>
                  <div className="text-sm text-muted-foreground">Total Tickets</div>
                </div>
                <div className="card text-center">
                   <div className="text-2xl font-bold text-primary">{stats.openTickets}</div>
                  <div className="text-sm text-muted-foreground">Open</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.inProgressTickets}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
              </div>

              {/* Project Notes */}
              {project.notes && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">Project Notes</h2>
                  <div className="text-foreground whitespace-pre-wrap">{project.notes}</div>
                </div>
              )}

              {/* Tickets List */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Tickets ({tickets.length})
                  </h2>
                    <Link
                      to={`/admin/tickets?project=${projectId}`}
                      className="text-primary hover:underline text-sm"
                    >
                    View All Tickets
                  </Link>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tickets for this project yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.slice(0, 10).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          </div>
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={ticket.status} />
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded capitalize">
                            {ticket.type.replace("_", " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
