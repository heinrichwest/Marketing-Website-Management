"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getTicketsByUserId, getProjectById } from "@/lib/mock-data"
import StatusBadge from "@/components/status-badge"
import PriorityBadge from "@/components/priority-badge"
import { formatRelativeTime } from "@/lib/utils"
import type { Ticket } from "@/types"

export default function DeveloperTicketsPage() {
  const { isSignedIn, user } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all")

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    } else if (user?.role !== "web_developer") {
      router.push("/dashboard")
    }
  }, [isSignedIn, user, router])

  if (!user || user.role !== "web_developer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const allTickets = getTicketsByUserId(user.id, user.role)

  const filteredTickets = filter === "all"
    ? allTickets
    : allTickets.filter(t => t.status === filter)

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
            <p className="text-muted-foreground">Manage and track your assigned tickets</p>
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
              <div className="text-4xl font-bold text-blue-600">{stats.overSevenDays}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex gap-4 flex-wrap">
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
          </div>

          {/* Tickets Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy-900">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-[#1e293b]">
                      PROJECT
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-[#1e293b]">
                      TITLE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-[#1e293b]">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-[#1e293b]">
                      SEVERITY
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider bg-[#1e293b]">
                      DAYS OPEN
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
                              href={`/projects/${ticket.projectId}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {project?.name || "Unknown Project"}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {ticket.status === "in_progress" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Dev started working on ticket
                              </span>
                            )}
                            {ticket.status === "resolved" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Resolved
                              </span>
                            )}
                            {ticket.status === "open" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                Open
                              </span>
                            )}
                            {ticket.status === "closed" && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-white">
                                Closed
                              </span>
                            )}
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
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
