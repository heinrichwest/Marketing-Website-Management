import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getTicketsByUserId, getProjectById, updateTicket, notifyAdminsOfResolution } from "@/lib/mock-data"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { formatRelativeTime } from "@/lib/utils"
import type { Ticket } from "@/types"

export default function DeveloperTicketsPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    } else if (user?.role !== "web_developer") {
      navigate("/dashboard")
    }
  }, [isSignedIn, user, navigate])

  if (!user || user.role !== "web_developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [tickets, setTickets] = useState<any[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sentMessages, setSentMessages] = useState<Set<string>>(new Set())

  const fetchTickets = () => {
    if (user) {
      const userTickets = getTicketsByUserId(user.id, user.role)
      setTickets(userTickets)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [user, refreshTrigger])

  const allTickets = tickets

  const filteredTickets = allTickets
    .filter(t => filter === "all" || t.status === filter)
    .filter(t =>
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicket(ticketId, { status: newStatus as any })
    if (newStatus === "resolved") {
      notifyAdminsOfResolution(ticketId, user!.id)
    }
    setRefreshTrigger(prev => prev + 1) // Trigger re-fetch
  }

  const stats = {
    totalAssigned: allTickets.length,
    critical: allTickets.filter((t) => t.priority === "critical" && t.status !== "resolved" && t.status !== "closed").length,
    overSevenDays: allTickets.filter((t) => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff > 7 && t.status !== "resolved" && t.status !== "closed"
    }).length,
  }

  const getDaysOpen = (createdAt: Date) => {
    return Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  }

  const getStatusText = (ticket: Ticket) => {
    if (ticket.status === "in_progress") {
      return "Dev started working on ticket"
    }
    if (ticket.status === "resolved") {
      return "Resolved"
    }
    if (ticket.status === "open") {
      return "Open"
    }
    return ticket.status
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
           {/* Header */}
           <div className="mb-8">
             <h1 className="text-4xl font-bold text-foreground mb-2">My Tickets</h1>
             <p className="text-muted-foreground">Manage and track your assigned tickets from Web Developer</p>
             <div className="mt-4">
               <Link to="/developer/dashboard" className="btn-outline">
                 ← Back to Dashboard
               </Link>
             </div>
           </div>

           {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Assigned */}
            <div className="bg-white rounded-lg border-2 border-amber-400 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">TOTAL ASSIGNED</div>
              <div className="text-4xl font-bold text-gray-900">{stats.totalAssigned}</div>
            </div>

            {/* Critical */}
            <div className="bg-red-50 rounded-lg border-2 border-red-400 p-6">
              <div className="text-sm font-medium text-red-800 mb-2">CRITICAL</div>
              <div className="text-4xl font-bold text-red-600">{stats.critical}</div>
            </div>

            {/* Over 7 Days */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-sm font-medium text-gray-600 mb-2">&gt; 7 DAYS</div>
              <div className="text-4xl font-bold text-primary">{stats.overSevenDays}</div>
            </div>
          </div>

           {/* Filters */}
           <div className="card mb-6">
             <div className="flex flex-col gap-4">
               <div className="flex gap-4 flex-wrap items-center justify-between">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                All Tickets
              </button>
              <button
                onClick={() => setFilter("open")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "open"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter("in_progress")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "in_progress"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                In Progress
              </button>
               <button
                 onClick={() => setFilter("resolved")}
                 className={`px-4 py-2 rounded-md font-medium transition ${
                   filter === "resolved"
                     ? "bg-primary text-primary-foreground"
                     : "bg-muted text-muted-foreground hover:bg-muted/70"
                 }`}
               >
                 Resolved
               </button>
               </div>

               {/* Search */}
               <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground">Search:</span>
                 <input
                   type="text"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="border border-border rounded px-3 py-2 bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
                   placeholder="Search your tickets..."
                 />
               </div>
             </div>
           </div>

          {/* Tickets Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-900">
                  <tr className="border-b border-gray-200">
                     <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                       PROJECT
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                       TITLE
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                       STATUS
                     </th>
                     <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                       SEVERITY
                     </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                        DAYS OPEN
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-primary-foreground uppercase tracking-wider bg-primary">
                        ACTIONS
                      </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                      const project = getProjectById(ticket.projectId)
                      const daysOpen = getDaysOpen(ticket.createdAt)

                      return (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/projects/${ticket.projectId}`}
                              className="text-primary hover:text-primary-dark hover:underline"
                            >
                              {project?.name || "Unknown Project"}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-2">
                                <select
                                  value={ticket.status}
                                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                  className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
                                >
                                  <option value="open">Open</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <button
                                  onClick={() => notifyAdminsOfResolution(ticket.id, user!.id)}
                                  className="text-sm bg-red-500 text-white px-3 py-2 rounded font-semibold hover:bg-red-600 shadow-md"
                                >
                                  Message Admin
                                </button>
                                {ticket.status === "resolved" && (
                                  <div className="flex gap-1 items-center">
                                    <textarea
                                      placeholder={ticket.resolutionNotes || "Add resolution notes..."}
                                      defaultValue={ticket.resolutionNotes || ""}
                                      className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground w-24 h-12 resize-none"
                                      onBlur={(e) => {
                                        const value = e.target.value.trim()
                                        if (value && value !== ticket.resolutionNotes) {
                                          updateTicket(ticket.id, { resolutionNotes: value })
                                          setRefreshTrigger(prev => prev + 1)
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        notifyAdminsOfResolution(ticket.id, user!.id);
                                        setSentMessages(prev => new Set([...prev, ticket.id]));
                                      }}
                                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 whitespace-nowrap"
                                      title="Send resolution notification to admin"
                                      disabled={sentMessages.has(ticket.id)}
                                    >
                                      {sentMessages.has(ticket.id) ? "Sent!" : "Send"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.priority === "critical" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white uppercase">
                                CRITICAL
                              </span>
                            )}
                            {ticket.priority === "high" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-400 text-white uppercase">
                                HIGH
                              </span>
                            )}
                            {ticket.priority === "medium" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-400 text-gray-900 uppercase">
                                MEDIUM
                              </span>
                            )}
                            {ticket.priority === "low" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-400 text-gray-900 uppercase">
                                LOW
                              </span>
                            )}
                          </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 font-medium">{daysOpen}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => notifyAdminsOfResolution(ticket.id, user!.id)}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Message Admin
                              </button>
                            </td>
                         </tr>
                      )
                    })
                  ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No tickets found matching the selected filter.
                        </td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
