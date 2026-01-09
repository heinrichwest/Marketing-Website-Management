"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers } from "@/lib/mock-data"
import type { Project, Ticket, User, TimerSession, TimeEntry, TimeEntryType } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, differenceInMinutes } from "date-fns"

// Mock timer sessions and time entries
const mockTimerSessions: TimerSession[] = [
  {
    id: "timer-1",
    userId: "user-2",
    projectId: "proj-1",
    ticketId: "ticket-1",
    description: "Working on homepage hero image update",
    entryType: "development",
    startTime: new Date(),
    status: "running",
    accumulatedTime: 0,
    isBillable: true,
    hourlyRate: 75,
    tags: ["frontend", "design"]
  }
]

const mockTimeEntries: TimeEntry[] = [
  {
    id: "entry-1",
    userId: "user-2",
    projectId: "proj-1",
    ticketId: "ticket-1",
    description: "Homepage hero image implementation",
    entryType: "development",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    duration: 60,
    isBillable: true,
    hourlyRate: 75,
    tags: ["frontend", "design"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "entry-2",
    userId: "user-3",
    projectId: "proj-2",
    description: "Client meeting - Andebe platform requirements",
    entryType: "meeting",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    endTime: new Date(Date.now() - 23.5 * 60 * 60 * 1000), // Yesterday + 30min
    duration: 30,
    isBillable: true,
    hourlyRate: 85,
    tags: ["meeting", "client"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function TimeTrackingPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [activeTimer, setActiveTimer] = useState<TimerSession | null>(null)
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>(mockTimerSessions)
  const initialTimeEntries = useMemo(() => mockTimeEntries, [])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [projects, setProjects] = useState<Project[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week")

  // Timer state
  const [timerForm, setTimerForm] = useState({
    projectId: "",
    ticketId: "",
    description: "",
    entryType: "development" as TimeEntryType,
    isBillable: true,
    tags: ""
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    setProjects(getProjects())
    setTickets(getTickets())
    setUsers(getUsers())

    // Update current time every second for active timers
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [isSignedIn, navigate])

  // Calculate elapsed time for active timer
  const getElapsedTime = (session: TimerSession) => {
    const startTime = new Date(session.startTime)
    const now = currentTime
    return differenceInMinutes(now, startTime)
  }

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Start timer
  const startTimer = () => {
    if (!user || !timerForm.description.trim()) return

    const newSession: TimerSession = {
      id: `timer-${Date.now()}`,
      userId: user.id,
      projectId: timerForm.projectId || undefined,
      ticketId: timerForm.ticketId || undefined,
      description: timerForm.description,
      entryType: timerForm.entryType,
      startTime: new Date(),
      status: "running",
      accumulatedTime: 0,
      isBillable: timerForm.isBillable,
      tags: timerForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    setActiveTimer(newSession)
    setTimerSessions(prev => [newSession, ...prev])
  }

  // Stop timer
  const stopTimer = () => {
    if (!activeTimer || !user) return

    const endTime = new Date()
    const duration = differenceInMinutes(endTime, new Date(activeTimer.startTime))

    // Create time entry
    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      userId: user.id,
      projectId: activeTimer.projectId,
      ticketId: activeTimer.ticketId,
      description: activeTimer.description,
      entryType: activeTimer.entryType,
      startTime: activeTimer.startTime,
      endTime: endTime,
      duration: duration,
      isBillable: activeTimer.isBillable,
      hourlyRate: activeTimer.hourlyRate,
      tags: activeTimer.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTimeEntries(prev => [newEntry, ...prev])
    setActiveTimer(null)
    setTimerSessions(prev => prev.filter(s => s.id !== activeTimer.id))

    // Reset form
    setTimerForm({
      projectId: "",
      ticketId: "",
      description: "",
      entryType: "development",
      isBillable: true,
      tags: ""
    })
  }

  // Get time entries for selected period
  const getFilteredEntries = () => {
    const now = new Date()
    let startDate: Date

    switch (selectedPeriod) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        startDate = startOfWeek(now)
        break
      case "month":
        startDate = startOfMonth(now)
        break
      default:
        startDate = startOfWeek(now)
    }

    return timeEntries.filter(entry =>
      new Date(entry.startTime) >= startDate &&
      entry.userId === user?.id
    )
  }

  // Calculate totals
  const calculateTotals = (entries: TimeEntry[]) => {
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0)
    const billableMinutes = entries
      .filter(entry => entry.isBillable)
      .reduce((sum, entry) => sum + entry.duration, 0)
    const totalAmount = entries
      .filter(entry => entry.isBillable && entry.hourlyRate)
      .reduce((sum, entry) => sum + (entry.duration / 60) * (entry.hourlyRate || 0), 0)

    return {
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      billableHours: Math.round((billableMinutes / 60) * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100
    }
  }

  const filteredEntries = getFilteredEntries()
  const totals = calculateTotals(filteredEntries)

  // Get project and ticket names
  const getProjectName = (projectId?: string) => {
    if (!projectId) return "No Project"
    const project = projects.find(p => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  const getTicketTitle = (ticketId?: string) => {
    if (!ticketId) return null
    const ticket = tickets.find(t => t.id === ticketId)
    return ticket?.title
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-8 lg:py-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link to="/admin/dashboard" className="btn-outline text-sm">
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Time Tracking</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Track your work hours, monitor productivity, and manage billable time
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2">
              {[
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value as typeof selectedPeriod)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-gray-800 border border-border hover:bg-muted"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Active Timer */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {activeTimer ? "Active Timer" : "Start Tracking Time"}
                </h2>

                {activeTimer ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-mono font-bold text-primary mb-4">
                        {formatTime(getElapsedTime(activeTimer))}
                      </div>
                      <div className="text-lg text-muted-foreground mb-2">
                        {activeTimer.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Project: {getProjectName(activeTimer.projectId)}
                        {activeTimer.ticketId && (
                          <span> • Ticket: {getTicketTitle(activeTimer.ticketId)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={stopTimer}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                        Stop Timer
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); startTimer() }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Project
                        </label>
                        <select
                          value={timerForm.projectId}
                          onChange={(e) => setTimerForm(prev => ({ ...prev, projectId: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="">Select Project (Optional)</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Ticket
                        </label>
                        <select
                          value={timerForm.ticketId}
                          onChange={(e) => setTimerForm(prev => ({ ...prev, ticketId: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="">Select Ticket (Optional)</option>
                          {tickets
                            .filter(ticket => !timerForm.projectId || ticket.projectId === timerForm.projectId)
                            .map((ticket) => (
                              <option key={ticket.id} value={ticket.id}>
                                {ticket.title}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={timerForm.description}
                        onChange={(e) => setTimerForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What are you working on?"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Activity Type
                        </label>
                        <select
                          value={timerForm.entryType}
                          onChange={(e) => setTimerForm(prev => ({ ...prev, entryType: e.target.value as TimeEntryType }))}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="development">Development</option>
                          <option value="design">Design</option>
                          <option value="meeting">Meeting</option>
                          <option value="review">Review</option>
                          <option value="planning">Planning</option>
                          <option value="testing">Testing</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="billable"
                          checked={timerForm.isBillable}
                          onChange={(e) => setTimerForm(prev => ({ ...prev, isBillable: e.target.checked }))}
                          className="w-4 h-4 rounded border-border"
                        />
                        <label htmlFor="billable" className="text-sm font-medium text-foreground">
                          Billable
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={timerForm.tags}
                          onChange={(e) => setTimerForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="frontend, backend, etc."
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary py-3"
                    >
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polygon points="10,8 16,12 10,16 10,8"/>
                      </svg>
                      Start Timer
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">This {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Hours</span>
                    <span className="text-xl font-bold text-foreground">{totals.totalHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Billable Hours</span>
                    <span className="text-xl font-bold text-green-600">{totals.billableHours}h</span>
                  </div>
                  {totals.totalAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="text-xl font-bold text-primary">${totals.totalAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Entries</span>
                    <span className="text-sm font-medium">{filteredEntries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg per day</span>
                    <span className="text-sm font-medium">
                      {selectedPeriod === "week" ? Math.round((totals.totalHours / 7) * 10) / 10 :
                       selectedPeriod === "month" ? Math.round((totals.totalHours / 30) * 10) / 10 :
                       Math.round(totals.totalHours * 10) / 10}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Most active project</span>
                    <span className="text-sm font-medium">
                      {filteredEntries.length > 0 ? getProjectName(filteredEntries[0].projectId) : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="text-2xl font-bold text-foreground">Time Entries</h2>
              <p className="text-muted-foreground">Detailed breakdown of your tracked time</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Description</th>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Project</th>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Duration</th>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-6 font-semibold text-foreground">Billable</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="py-3 px-6">
                        <div>
                          <div className="font-medium text-foreground">{entry.description}</div>
                          {entry.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {entry.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                              {entry.tags.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{entry.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-muted-foreground">
                        {getProjectName(entry.projectId)}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`text-xs px-2 py-1 rounded ${
                          entry.entryType === 'development' ? 'bg-primary/10 text-primary' :
                          entry.entryType === 'design' ? 'bg-purple-100 text-purple-800' :
                          entry.entryType === 'meeting' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="py-3 px-6 font-medium">
                        {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                      </td>
                      <td className="py-3 px-6 text-muted-foreground">
                        {format(new Date(entry.startTime), "MMM dd")}
                      </td>
                      <td className="py-3 px-6">
                        {entry.isBillable ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No time entries found for the selected period
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