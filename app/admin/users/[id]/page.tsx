"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getUserById, getProjects, getTickets } from "@/lib/mock-data"
import { getRoleDisplayName, getRoleColor, formatRelativeTime } from "@/lib/utils"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import type { User, Project, Ticket } from "@/types"

export default function ViewUserPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const userId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [userTickets, setUserTickets] = useState<Ticket[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "admin") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  useEffect(() => {
    if (userId) {
      const userData = getUserById(userId)
      if (userData) {
        setCurrentUser(userData)

        // Get projects associated with this user
        const allProjects = getProjects()
        const relatedProjects = allProjects.filter(
          (p) =>
            p.clientId === userId ||
            p.webDeveloperId === userId ||
            p.socialMediaCoordinatorId === userId
        )
        setUserProjects(relatedProjects)

        // Get tickets created by or assigned to this user
        const allTickets = getTickets()
        const relatedTickets = allTickets.filter(
          (t) => t.createdBy === userId || t.assignedTo === userId
        )
        setUserTickets(relatedTickets)

        setIsLoading(false)
      } else {
        navigate("/admin/users")
      }
    }
  }, [userId, navigate])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading || !currentUser) {
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
    totalProjects: userProjects.length,
    activeProjects: userProjects.filter((p) => p.status === "active").length,
    createdTickets: userTickets.filter((t) => t.createdBy === userId).length,
    assignedTickets: userTickets.filter((t) => t.assignedTo === userId).length,
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
                to="/admin/users"
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
              <h1 className="text-4xl font-bold text-foreground">{currentUser.fullName}</h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getRoleColor(
                  currentUser.role
                )}`}
              >
                {getRoleDisplayName(currentUser.role)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={`/admin/users/${userId}/edit`}
                className="btn-primary"
              >
                Edit User
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="text-foreground">{currentUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Phone</div>
                    <div className="text-foreground">{currentUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                        currentUser.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentUser.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Account Details</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">User ID</div>
                    <div className="text-foreground font-mono text-sm">{currentUser.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Created</div>
                    <div className="text-foreground">
                      {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                    <div className="text-foreground">
                      {new Date(currentUser.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="card">
                <h2 className="text-xl font-bold text-foreground mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Projects</span>
                    <span className="font-bold text-foreground">{stats.totalProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Projects</span>
                    <span className="font-bold text-green-600">{stats.activeProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tickets Created</span>
                    <span className="font-bold text-foreground">{stats.createdTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tickets Assigned</span>
                    <span className="font-bold text-foreground">{stats.assignedTickets}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects and Tickets */}
            <div className="lg:col-span-2 space-y-8">
              {/* Projects */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Associated Projects ({userProjects.length})
                  </h2>
                </div>

                {userProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No projects associated with this user
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProjects.map((project) => {
                      const role =
                        project.clientId === userId
                          ? "Client"
                          : project.webDeveloperId === userId
                          ? "Web Developer"
                          : "Social Media Coordinator"

                      return (
                        <div
                          key={project.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <StatusBadge status={project.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Role: <span className="text-foreground font-medium">{role}</span>
                            </span>
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className="text-primary hover:underline"
                            >
                              View Project
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Tickets */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Related Tickets ({userTickets.length})
                  </h2>
                </div>

                {userTickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tickets associated with this user
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTickets.slice(0, 10).map((ticket) => {
                      const project = getProjects().find((p) => p.id === ticket.projectId)
                      const isCreator = ticket.createdBy === userId
                      const isAssigned = ticket.assignedTo === userId

                      return (
                        <div
                          key={ticket.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                              <p className="text-sm text-muted-foreground">{project?.name}</p>
                            </div>
                            <PriorityBadge priority={ticket.priority} />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={ticket.status} />
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              {isCreator && "Creator"}
                              {isCreator && isAssigned && " & "}
                              {isAssigned && "Assigned"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(ticket.createdAt)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
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
