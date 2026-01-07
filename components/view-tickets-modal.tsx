"use client"

import { getTicketsByProjectId, getUsers } from "@/lib/mock-data"
import { formatRelativeTime } from "@/lib/utils"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import type { Project, Ticket } from "@/types"

interface ViewTicketsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ViewTicketsModal({ project, isOpen, onClose }: ViewTicketsModalProps) {
  if (!isOpen || !project) return null

  const tickets = getTicketsByProjectId(project.id)
  const users = getUsers()

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tickets for {project.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {stats.total} tickets
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="card text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary">{stats.open}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
              <div className="text-xs text-muted-foreground">Closed</div>
            </div>
          </div>

          {/* Tickets List */}
          {tickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p className="text-lg font-medium">No tickets yet</p>
              <p className="text-sm">This project doesn't have any tickets</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                   <tr className="bg-primary text-primary-foreground">
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">#</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Title</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Type</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Priority</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Status</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Created By</th>
                     <th className="px-4 py-3 text-left font-semibold border-r border-primary/50 text-sm">Assigned To</th>
                     <th className="px-4 py-3 text-left font-semibold text-sm">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => {
                    const creator = users.find((u) => u.id === ticket.createdBy)
                    const assignee = users.find((u) => u.id === ticket.assignedTo)

                    return (
                      <tr
                        key={ticket.id}
                        className={`${
                          index % 2 === 0 ? "bg-background" : "bg-muted/30"
                        } hover:bg-secondary/10 transition border-b border-border`}
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-semibold text-foreground text-sm">{ticket.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {ticket.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {ticket.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {creator ? (
                              <>
                                <div className="font-medium text-foreground text-xs">{creator.fullName}</div>
                                <div className="text-xs text-muted-foreground">{creator.email}</div>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Unknown</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {assignee ? (
                              <>
                                <div className="font-medium text-foreground text-xs">{assignee.fullName}</div>
                                <div className="text-xs text-muted-foreground">{assignee.email}</div>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Not assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatRelativeTime(ticket.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-border">
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
