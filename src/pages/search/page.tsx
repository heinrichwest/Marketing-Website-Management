"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getTickets, getProjects, getUsers, getMessages } from "@/lib/mock-data"
import type { Ticket, Project, User } from "@/types"

export default function SearchPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{
    tickets: Ticket[]
    projects: Project[]
    users: User[]
    messages: any[]
  }>({ tickets: [], projects: [], users: [], messages: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [searchIn, setSearchIn] = useState({
    projects: true,
    tickets: true,
    users: true,
    messages: true
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    }
  }, [isSignedIn, navigate])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ tickets: [], projects: [], users: [], messages: [] })
      return
    }

    setIsLoading(true)

    // Simple search implementation
    const searchTerm = query.toLowerCase()

    const tickets = searchIn.tickets ? getTickets().filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm) ||
      ticket.id.toLowerCase().includes(searchTerm) ||
      ticket.type.replace('_', ' ').toLowerCase().includes(searchTerm)
    ) : []

    const projects = searchIn.projects ? getProjects().filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.id.toLowerCase().includes(searchTerm)
    ) : []

    const users = searchIn.users ? getUsers().filter(u =>
      u.fullName.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm) ||
      u.role.toLowerCase().includes(searchTerm)
    ) : []

    const messages = searchIn.messages ? getMessages().filter(msg =>
      (msg.subject && msg.subject.toLowerCase().includes(searchTerm)) ||
      (msg.content && msg.content.toLowerCase().includes(searchTerm))
    ) : []

    setResults({ tickets, projects, users, messages })
    setIsLoading(false)
  }, [query, searchIn])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalResults = results.tickets.length + results.projects.length + results.users.length + results.messages.length

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to={
                  user.role === 'admin' ? '/admin/dashboard' :
                  user.role === 'web_developer' ? '/developer/dashboard' :
                  user.role === 'social_media_coordinator' ? '/coordinator/dashboard' :
                  '/client-portal/dashboard'
                }
                className="btn-outline text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Global Search</h1>
              <p className="text-muted-foreground">Find anything across your entire workspace - projects, tickets, users, and messages</p>
              <p className="text-xs text-muted-foreground mt-2">🚀 Deployed automatically via GitHub Actions</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="card mb-8">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for projects, tickets, users, messages..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg"
                />
              </div>

              {/* Search Filters */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Search in:</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(searchIn).map(([key, enabled]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setSearchIn(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setQuery("")}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/70 transition text-sm"
                  disabled={!query}
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {query && (
            <div className="space-y-8">
              {/* Summary */}
              <div className="text-center">
                {isLoading ? (
                  <p className="text-muted-foreground">Searching...</p>
                ) : (
                  <p className="text-muted-foreground">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                  </p>
                )}
              </div>

              {/* Tickets */}
              {results.tickets.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Tickets ({results.tickets.length})
                  </h2>
                  <div className="space-y-4">
                    {results.tickets.slice(0, 10).map(ticket => (
                      <div key={ticket.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {ticket.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/admin/tickets`}
                            className="text-primary hover:text-primary-dark text-sm underline"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Projects ({results.projects.length})
                  </h2>
                  <div className="space-y-4">
                    {results.projects.slice(0, 10).map(project => (
                      <div key={project.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {project.status}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="text-primary hover:text-primary-dark text-sm underline"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && user.role === 'admin' && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Users ({results.users.length})
                  </h2>
                  <div className="space-y-4">
                    {results.users.slice(0, 10).map(searchUser => (
                      <div key={searchUser.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{searchUser.fullName}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{searchUser.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {searchUser.role}
                              </span>
                            </div>
                          </div>
                          {user.role === 'admin' && (
                            <Link
                              to={`/admin/users/${searchUser.id}`}
                              className="text-primary hover:text-primary-dark text-sm underline"
                            >
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {results.messages.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Messages ({results.messages.length})
                  </h2>
                  <div className="space-y-4">
                    {results.messages.slice(0, 10).map(message => (
                      <div key={message.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{message.subject || 'No Subject'}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Message
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link
                            to="/messages"
                            className="text-primary hover:text-primary-dark text-sm underline"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <span className="text-6xl">🔍</span>
                  </div>
                  <p className="text-xl font-medium text-muted-foreground mb-2">0 results found</p>
                  <p className="text-muted-foreground mb-6">Try different keywords or check your spelling</p>

                  {/* Search Tips */}
                  <div className="card max-w-2xl mx-auto text-left">
                    <h3 className="text-lg font-semibold text-foreground mb-4">🔍 Search Tips</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground mb-2">What you can search:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Project names and descriptions</li>
                          <li>• Ticket titles and content</li>
                          <li>• User names and roles</li>
                          <li>• Message subjects and content</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">Advanced features:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Filter by content type</li>
                          <li>• Relevance-based ranking</li>
                          <li>• Real-time search results</li>
                          <li>• Direct navigation to results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}