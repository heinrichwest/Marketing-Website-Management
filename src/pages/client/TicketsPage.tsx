import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getTicketsByUserId, getProjects, getUsers } from "../../../lib/mock-data"
import StatusBadge from "../../../components/status-badge"
import PriorityBadge from "../../../components/priority-badge"
import { formatRelativeTime } from "../../../lib/utils"

export default function ClientTicketsPage() {
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

  const myTickets = getTicketsByUserId(user.id, user.role)
  const projects = getProjects()
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
                <h1 className="text-4xl font-bold text-foreground mb-2">My Tickets</h1>
                <p className="text-muted-foreground">View and manage all your project tickets</p>
              </div>
               <div className="flex gap-4">
                <Link to="/client/dashboard" className="btn-outline hover:border-accent hover:text-accent">
                  ← Back to Dashboard
                </Link>
                <Link to="/client/tickets/new" className="btn-primary hover:shadow-accent/20">
                  + Create New Ticket
                </Link>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {myTickets.length > 0 ? (
              myTickets.map((ticket) => {
                const project = projects.find((p) => p.id === ticket.projectId)
                const assignedDev = allUsers.find((u) => u.id === ticket.assignedTo)

                return (
                  <div
                    key={ticket.id}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{ticket.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {ticket.description}
                        </p>
                        {project && (
                          <p className="text-sm text-muted-foreground">
                            Project: <span className="font-medium">{project.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {ticket.type.replace("_", " ")}</span>
                        {assignedDev && (
                          <span>Assigned to: {assignedDev.fullName}</span>
                        )}
                        <span>{formatRelativeTime(ticket.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-outline text-sm">
                          View Details
                        </button>
                        <button className="btn-primary text-sm">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-4">No tickets yet</p>
                  <p className="text-sm mb-6">Create your first ticket to get started with your projects.</p>
                  <Link to="/client/tickets/new" className="btn-primary">
                    Create New Ticket
                  </Link>
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