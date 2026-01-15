import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getProjectsByUserId, getTicketsByUserId, getTicketsByProjectId, updateTicket, notifyAdminsOfResolution } from "@/lib/mock-data"
import StatCard from "@/components/stat-card"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { getStageDisplayName, formatRelativeTime, getTicketTypeDisplayName } from "@/lib/utils"

export default function DeveloperDashboard() {
   const { isSignedIn, user } = useAuth()
   const navigate = useNavigate()
   const [refreshKey, setRefreshKey] = useState(0)
   const [updatingTicket, setUpdatingTicket] = useState<string | null>(null)

   useEffect(() => {
     if (!isSignedIn) {
       navigate("/login")
     } else if (user?.role !== "web_developer") {
       navigate("/dashboard")
     }
   }, [isSignedIn, user, navigate])

   // Refresh when tickets are updated
   useEffect(() => {
     const handleTicketsUpdated = () => setRefreshKey(prev => prev + 1)
     window.addEventListener('ticketsUpdated', handleTicketsUpdated)
     return () => window.removeEventListener('ticketsUpdated', handleTicketsUpdated)
   }, [])

  if (!user || user.role !== "web_developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

   // Refresh data when refreshKey changes
   useEffect(() => {
     // Force re-evaluation of data
   }, [refreshKey])

   const myProjects = getProjectsByUserId(user.id, user.role)
   const myTickets = getTicketsByUserId(user.id, user.role)

   const stats = {
     assignedProjects: myProjects.length,
     openTickets: myTickets.filter((t) => t.status === "open").length,
     inProgressTickets: myTickets.filter((t) => t.status === "in_progress").length,
     resolvedTickets: myTickets.filter((t) => t.status === "resolved").length,
   }

   const recentProjects = myProjects.slice(0, 3)
   const recentTickets = myTickets.slice(0, 5)

   const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
     setUpdatingTicket(ticketId)
     try {
       updateTicket(ticketId, { status: newStatus as any })
       setRefreshKey(prev => prev + 1)
     } catch (error) {
       console.error('Failed to update ticket status:', error)
     } finally {
       setUpdatingTicket(null)
     }
   }

   const handleResolutionNotification = async (ticketId: string) => {
     setUpdatingTicket(ticketId)
     try {
       // First update ticket to resolved status
       updateTicket(ticketId, { status: "resolved" as any })
       // Then notify admins
       notifyAdminsOfResolution(ticketId, user!.id)
       setRefreshKey(prev => prev + 1)
     } catch (error) {
       console.error('Failed to notify admins of resolution:', error)
     } finally {
       setUpdatingTicket(null)
     }
   }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Developer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}! Here&apos;s your project overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Assigned Projects"
              value={stats.assignedProjects}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Open Tickets"
              value={stats.openTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedTickets}
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="flex gap-4 flex-wrap">
                <Link to="/developer/tickets" className="btn-primary hover:shadow-accent/20">
                  View Tickets
                </Link>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Projects */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">My Projects</h2>
              </div>

               {recentProjects.length > 0 ? (
                 <div className="space-y-4">
                   {recentProjects.map((project) => {
                     const projectTickets = getTicketsByProjectId(project.id).filter(ticket => ticket.assignedTo === user!.id)
                     return (
                       <div
                         key={project.id}
                         className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                       >
                         <div className="flex items-start justify-between mb-2">
                           <div className="flex-1">
                             <h3 className="font-semibold text-foreground">{project.name}</h3>
                             <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                           </div>
                           <StatusBadge status={project.status} />
                         </div>
                         <div className="flex items-center gap-4 text-sm mt-3">
                           <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-primary text-xs font-medium">
                             {getStageDisplayName(project.currentStage)}
                           </span>
                           <span className="text-muted-foreground text-xs">
                             Updated {formatRelativeTime(project.updatedAt)}
                           </span>
                         </div>
                         {projectTickets.length > 0 && (
                           <div className="mt-4">
                             <h4 className="text-sm font-medium text-foreground mb-2">My Tickets:</h4>
                             <div className="space-y-2">
                               {projectTickets.slice(0, 2).map((ticket) => (
                                 <div key={ticket.id} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                                   <div className="flex-1">
                                     <p className="text-sm font-medium text-foreground truncate">{ticket.title}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                       <StatusBadge status={ticket.status} />
                                       <PriorityBadge priority={ticket.priority} />
                                     </div>
                                   </div>
                                   <div className="flex gap-2 ml-2">
                                     {ticket.status === "open" && (
                                       <button
                                         onClick={() => handleStatusUpdate(ticket.id, "in_progress")}
                                         disabled={updatingTicket === ticket.id}
                                         className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                       >
                                         {updatingTicket === ticket.id ? "..." : "Start"}
                                       </button>
                                     )}
                                     {ticket.status === "in_progress" && (
                                       <button
                                         onClick={() => handleResolutionNotification(ticket.id)}
                                         disabled={updatingTicket === ticket.id}
                                         className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                       >
                                         {updatingTicket === ticket.id ? "..." : "Update"}
                                       </button>
                                     )}
                                     {ticket.status === "resolved" && (
                                       <button
                                         onClick={() => handleStatusUpdate(ticket.id, "resolved")}
                                         disabled={updatingTicket === ticket.id}
                                         className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                                       >
                                         {updatingTicket === ticket.id ? "..." : "Update"}
                                       </button>
                                     )}
                                   </div>
                                 </div>
                               ))}
                               {projectTickets.length > 2 && (
                                 <p className="text-xs text-muted-foreground text-center">
                                   +{projectTickets.length - 2} more tickets
                                 </p>
                               )}
                             </div>
                           </div>
                         )}
                       </div>
                     )
                   })}
                 </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No projects assigned yet.</p>
                </div>
              )}
            </div>

             {/* My Tickets */}
             <div className="card">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">My Tickets</h2>
               </div>

               {recentTickets.length > 0 ? (
                 <div className="space-y-4">
                   {recentTickets.map((ticket) => (
                     <div
                       key={ticket.id}
                       className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                     >
                       <div className="flex items-start justify-between mb-2">
                         <div className="flex-1">
                           <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                           <p className="text-sm text-muted-foreground">{getTicketTypeDisplayName(ticket.type)}</p>
                         </div>
                         <PriorityBadge priority={ticket.priority} />
                       </div>
                       <div className="flex items-center gap-2 flex-wrap mt-3">
                         <StatusBadge status={ticket.status} />
                         <span className="text-xs text-muted-foreground">
                           {formatRelativeTime(ticket.createdAt)}
                         </span>
                       </div>
                        <div className="flex items-center gap-2 mt-3">
                          {ticket.status !== "closed" && (
                            <>
                              {ticket.status === "open" && (
                                <button
                                  onClick={() => handleStatusUpdate(ticket.id, "in_progress")}
                                  disabled={updatingTicket === ticket.id}
                                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                  {updatingTicket === ticket.id ? "Updating..." : "Start Working"}
                                </button>
                              )}
                              {ticket.status === "in_progress" && (
                                <button
                                  onClick={() => handleResolutionNotification(ticket.id)}
                                  disabled={updatingTicket === ticket.id}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                >
                                  {updatingTicket === ticket.id ? "Notifying..." : "Update - I have resolved this ticket"}
                                </button>
                              )}
                              {ticket.status === "resolved" && (
                                <button
                                  onClick={() => handleStatusUpdate(ticket.id, "resolved")}
                                  disabled={updatingTicket === ticket.id}
                                  className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                                >
                                  {updatingTicket === ticket.id ? "Updating..." : "Update"}
                                </button>
                              )}
                            </>
                          )}
                         <Link
                           to={`/developer/tickets`}
                           className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                         >
                           View Details
                         </Link>
                       </div>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tickets assigned yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
