"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getUsers } from "@/lib/mock-data"
import type { CalendarEvent, Project, User } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns"

// Mock calendar events data
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "event-1",
    title: "SpecCon Website Launch Meeting",
    description: "Final review before launch",
    eventType: "meeting",
    priority: "high",
    startDate: new Date(2025, 0, 15, 10, 0), // Jan 15, 2025, 10:00 AM
    endDate: new Date(2025, 0, 15, 11, 30), // Jan 15, 2025, 11:30 AM
    allDay: false,
    location: "Conference Room A",
    attendees: ["user-1", "user-2", "user-3", "user-5"],
    organizerId: "user-1",
    projectId: "proj-1",
    isRecurring: false,
    recurrenceType: "none",
    reminderMinutes: 15,
    status: "confirmed",
    notes: "Please review final designs before meeting",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "event-2",
    title: "Andebe Platform Deadline",
    description: "Development completion deadline",
    eventType: "deadline",
    priority: "critical",
    startDate: new Date(2025, 0, 20), // Jan 20, 2025
    endDate: new Date(2025, 0, 20),
    allDay: true,
    attendees: ["user-2", "user-3"],
    organizerId: "user-1",
    projectId: "proj-2",
    isRecurring: false,
    recurrenceType: "none",
    reminderMinutes: 1440, // 24 hours
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "event-3",
    title: "Client Presentation - Megrolowveld",
    description: "Present design concepts to client",
    eventType: "presentation",
    priority: "high",
    startDate: new Date(2025, 0, 18, 14, 0), // Jan 18, 2025, 2:00 PM
    endDate: new Date(2025, 0, 18, 15, 30), // Jan 18, 2025, 3:30 PM
    allDay: false,
    location: "Virtual Meeting",
    attendees: ["user-1", "user-4", "user-5", "user-6"],
    organizerId: "user-1",
    projectId: "proj-3",
    isRecurring: false,
    recurrenceType: "none",
    reminderMinutes: 30,
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "event-4",
    title: "Weekly Team Standup",
    description: "Weekly progress update and planning",
    eventType: "meeting",
    priority: "medium",
    startDate: new Date(2025, 0, 16, 9, 0), // Jan 16, 2025, 9:00 AM
    endDate: new Date(2025, 0, 16, 9, 30), // Jan 16, 2025, 9:30 AM
    allDay: false,
    location: "Main Conference Room",
    attendees: ["user-1", "user-2", "user-3", "user-4"],
    organizerId: "user-1",
    isRecurring: true,
    recurrenceType: "weekly",
    recurrenceEndDate: new Date(2025, 11, 31), // End of year
    reminderMinutes: 5,
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function CalendarPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents)
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    setProjects(getProjects())
    setUsers(getUsers())
  }, [isSignedIn, navigate])

  // Get events for current view
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      if (event.allDay) {
        return isSameDay(event.startDate, date)
      }
      return isSameDay(event.startDate, date)
    })
  }

  // Get events for current month view
  const getMonthEvents = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return days.map(day => ({
      date: day,
      events: getEventsForDate(day)
    }))
  }

  // Get events for current week view
  const getWeekEvents = () => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return days.map(day => ({
      date: day,
      events: getEventsForDate(day)
    }))
  }

  // Navigate functions
  const navigatePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(prev => subMonths(prev, 1))
    } else if (viewMode === "week") {
      setCurrentDate(prev => subWeeks(prev, 1))
    } else {
      setCurrentDate(prev => addDays(prev, -1))
    }
  }

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(prev => addMonths(prev, 1))
    } else if (viewMode === "week") {
      setCurrentDate(prev => addWeeks(prev, 1))
    } else {
      setCurrentDate(prev => addDays(prev, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Event styling functions
  const getEventTypeColor = (type: string) => {
    const colors = {
      meeting: "bg-primary/10 text-primary border-primary/20",
      deadline: "bg-red-100 text-red-800 border-red-200",
      milestone: "bg-green-100 text-green-800 border-green-200",
      review: "bg-purple-100 text-purple-800 border-purple-200",
      maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      kickoff: "bg-indigo-100 text-indigo-800 border-indigo-200",
      presentation: "bg-pink-100 text-pink-800 border-pink-200"
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "border-l-4 border-l-green-500",
      medium: "border-l-4 border-l-yellow-500",
      high: "border-l-4 border-l-orange-500",
      critical: "border-l-4 border-l-red-500"
    }
    return colors[priority as keyof typeof colors] || ""
  }

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    return project?.name
  }

  const getAttendeeNames = (attendeeIds: string[]) => {
    return attendeeIds.map(id => {
      const user = users.find(u => u.id === id)
      return user?.fullName || "Unknown"
    }).join(", ")
  }

  const formatEventTime = (event: CalendarEvent) => {
    if (event.allDay) return "All Day"
    return `${format(event.startDate, "h:mm a")} - ${format(event.endDate, "h:mm a")}`
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
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Calendar</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Schedule meetings, track deadlines, and manage project timelines
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="btn-primary px-6 py-3"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Event
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={navigatePrevious}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
                  {viewMode === "month" && format(currentDate, "MMMM yyyy")}
                  {viewMode === "week" && `Week of ${format(startOfWeek(currentDate), "MMM dd")}`}
                  {viewMode === "day" && format(currentDate, "EEEE, MMMM dd, yyyy")}
                </h2>

                <button
                  onClick={navigateNext}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={goToToday}
                  className="btn-outline px-4 py-2"
                >
                  Today
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                {[
                  { value: "month", label: "Month" },
                  { value: "week", label: "Week" },
                  { value: "day", label: "Day" }
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as typeof viewMode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode.value
                        ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 overflow-hidden">
            {viewMode === "month" && (
              <div className="p-6">
                {/* Month Header */}
                <div className="grid grid-cols-7 gap-px mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-muted-foreground text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-7 gap-px">
                  {getMonthEvents().map(({ date, events: dayEvents }, index) => (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-border/20 ${
                        !isSameMonth(date, currentDate) ? "bg-muted/30" : "bg-background"
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground mb-2">
                        {format(date, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.eventType)} ${getPriorityColor(event.priority)}`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            {!event.allDay && (
                              <div className="text-xs opacity-75">{format(event.startDate, "h:mm a")}</div>
                            )}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "week" && (
              <div className="p-6">
                <div className="space-y-4">
                  {getWeekEvents().map(({ date, events: dayEvents }) => (
                    <div key={date.toISOString()} className="border border-border/50 rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-3">
                        {format(date, "EEEE, MMMM dd")}
                      </h3>
                      <div className="space-y-2">
                        {dayEvents.length > 0 ? (
                          dayEvents.map(event => (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity ${getEventTypeColor(event.eventType)} ${getPriorityColor(event.priority)}`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <p className="text-sm opacity-75">{formatEventTime(event)}</p>
                                  {event.location && (
                                    <p className="text-sm opacity-75">📍 {event.location}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs px-2 py-1 rounded ${getEventTypeColor(event.eventType)}`}>
                                    {event.eventType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">No events scheduled</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "day" && (
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  {format(currentDate, "EEEE, MMMM dd, yyyy")}
                </h3>

                <div className="space-y-4">
                  {getEventsForDate(currentDate).length > 0 ? (
                    getEventsForDate(currentDate).map(event => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getEventTypeColor(event.eventType)} ${getPriorityColor(event.priority)}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold">{event.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">Time</p>
                            <p className="text-sm">{formatEventTime(event)}</p>
                          </div>
                          {event.location && (
                            <div>
                              <p className="text-sm font-medium text-foreground">Location</p>
                              <p className="text-sm">{event.location}</p>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-foreground">Description</p>
                            <p className="text-sm">{event.description}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-foreground">Attendees</p>
                            <p className="text-sm">{getAttendeeNames(event.attendees)}</p>
                          </div>
                          {event.projectId && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">Project</p>
                              <p className="text-sm">{getProjectName(event.projectId)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-muted-foreground text-lg">No events scheduled for this day</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Events will be shown in the calendar above */}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Events</h3>

              <div className="space-y-3">
                {events
                  .filter(event => event.startDate >= new Date())
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity ${getEventTypeColor(event.eventType)} ${getPriorityColor(event.priority)}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                      <p className="text-xs opacity-75">
                        {format(event.startDate, "MMM dd")} • {formatEventTime(event)}
                      </p>
                      {event.location && (
                        <p className="text-xs opacity-75">📍 {event.location}</p>
                      )}
                    </div>
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <h4 className="font-semibold text-foreground mb-3">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Meeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Deadline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Milestone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Detail Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-foreground">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Date & Time</h4>
                      <p className="text-foreground">{format(selectedEvent.startDate, "EEEE, MMMM dd, yyyy")}</p>
                      <p className="text-muted-foreground">{formatEventTime(selectedEvent)}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Type & Priority</h4>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getEventTypeColor(selectedEvent.eventType)}`}>
                          {selectedEvent.eventType}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          selectedEvent.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          selectedEvent.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedEvent.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedEvent.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Location</h4>
                      <p className="text-foreground">📍 {selectedEvent.location}</p>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-foreground">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Attendees</h4>
                    <p className="text-foreground">{getAttendeeNames(selectedEvent.attendees)}</p>
                  </div>

                  {selectedEvent.projectId && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Related Project</h4>
                      <p className="text-foreground">{getProjectName(selectedEvent.projectId)}</p>
                    </div>
                  )}

                  {selectedEvent.notes && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                      <p className="text-foreground">{selectedEvent.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="btn-outline px-6 py-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}