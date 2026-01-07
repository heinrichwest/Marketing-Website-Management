import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getProjectsByUserId, getUsers } from "../../../lib/mock-data"
import StatusBadge from "../../../components/status-badge"
import { getStageDisplayName, getStageProgress, formatRelativeTime } from "../../../lib/utils"
import UserAvatar from "../../../components/user-avatar"

export default function ClientProjectsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "client") {
      navigate("/dashboard")
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

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">My Projects</h1>
                <p className="text-muted-foreground">View all your projects and their progress</p>
              </div>
              <Link to="/client/dashboard" className="btn-outline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.length > 0 ? (
              myProjects.map((project) => {
                const developer = allUsers.find((u) => u.id === project.webDeveloperId)
                const coordinator = allUsers.find((u) => u.id === project.socialMediaCoordinatorId)
                const progress = getStageProgress(project.currentStage)

                return (
                  <div
                    key={project.id}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{project.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Current Stage */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {getStageDisplayName(project.currentStage)}
                      </span>
                    </div>

                    {/* Team */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Team</h4>
                      <div className="flex items-center gap-2">
                        {developer && (
                          <div className="flex items-center gap-2">
                            <UserAvatar fullName={developer.fullName} size="sm" />
                            <span className="text-xs text-muted-foreground">Developer</span>
                          </div>
                        )}
                        {coordinator && (
                          <div className="flex items-center gap-2">
                            <UserAvatar fullName={coordinator.fullName} size="sm" />
                            <span className="text-xs text-muted-foreground">Coordinator</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/client/tickets/new?project=${project.id}`}
                        className="btn-primary flex-1 text-center"
                      >
                        Create Ticket
                      </Link>
                      <button className="btn-outline flex-1">
                        View Details
                      </button>
                    </div>

                    {/* Last Updated */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Updated {formatRelativeTime(project.updatedAt)}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-4">No projects yet</p>
                  <p className="text-sm">Contact your administrator to get started with a new project.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}