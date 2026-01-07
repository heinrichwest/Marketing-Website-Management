"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getProjects, getTickets, getUsers, getMessagesByUserId } from "@/lib/mock-data"
import type { Project, Ticket, User, Message } from "@/types"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface SearchResult {
  id: string
  type: 'project' | 'ticket' | 'user' | 'message'
  title: string
  description: string
  url: string
  metadata: Record<string, any>
  relevance: number
}

export default function GlobalSearchPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    projects: true,
    tickets: true,
    users: true,
    messages: true
  })

  // Load all data for searching
  const [allData, setAllData] = useState({
    projects: [] as Project[],
    tickets: [] as Ticket[],
    users: [] as User[],
    messages: [] as Message[]
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    // Load all searchable data
    const projects = getProjects()
    const tickets = getTickets()
    const users = getUsers()
    const messages = user ? getMessagesByUserId(user.id) : []

    setAllData({ projects, tickets, users, messages })
  }, [isSignedIn, user, navigate])

  // Advanced search function with relevance scoring
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const results: SearchResult[] = []
    const searchTerm = query.toLowerCase().trim()

    // Search projects
    if (selectedFilters.projects) {
      allData.projects.forEach(project => {
        const relevance = calculateRelevance(searchTerm, [
          project.name,
          project.description,
          project.projectType,
          project.currentStage,
          project.status
        ])

        if (relevance > 0) {
          results.push({
            id: project.id,
            type: 'project',
            title: project.name,
            description: project.description,
            url: `/admin/projects/${project.id}`,
            metadata: {
              status: project.status,
              stage: project.currentStage,
              type: project.projectType
            },
            relevance
          })
        }
      })
    }

    // Search tickets
    if (selectedFilters.tickets) {
      allData.tickets.forEach(ticket => {
        const relevance = calculateRelevance(searchTerm, [
          ticket.title,
          ticket.description,
          ticket.type,
          ticket.priority,
          ticket.status
        ])

        if (relevance > 0) {
          results.push({
            id: ticket.id,
            type: 'ticket',
            title: ticket.title,
            description: ticket.description,
            url: `/tickets?project=${ticket.projectId}`,
            metadata: {
              priority: ticket.priority,
              status: ticket.status,
              type: ticket.type
            },
            relevance
          })
        }
      })
    }

    // Search users
    if (selectedFilters.users) {
      allData.users.forEach(user => {
        const relevance = calculateRelevance(searchTerm, [
          user.fullName,
          user.email,
          user.role
        ])

        if (relevance > 0) {
          results.push({
            id: user.id,
            type: 'user',
            title: user.fullName,
            description: `${user.role} • ${user.email}`,
            url: `/admin/users/${user.id}`,
            metadata: {
              role: user.role,
              email: user.email,
              active: user.isActive
            },
            relevance
          })
        }
      })
    }

    // Search messages
    if (selectedFilters.messages) {
      allData.messages.forEach(message => {
        const relevance = calculateRelevance(searchTerm, [
          message.subject,
          message.content
        ])

        if (relevance > 0) {
          results.push({
            id: message.id,
            type: 'message',
            title: message.subject,
            description: message.content.substring(0, 100) + "...",
            url: "/messages",
            metadata: {
              sender: message.senderId,
              date: message.createdAt
            },
            relevance
          })
        }
      })
    }

    // Sort by relevance and limit results
    results.sort((a, b) => b.relevance - a.relevance)
    setSearchResults(results.slice(0, 50))
    setIsSearching(false)
  }

  // Calculate relevance score based on various factors
  const calculateRelevance = (searchTerm: string, fields: string[]): number => {
    let score = 0
    const terms = searchTerm.split(' ')

    fields.forEach(field => {
      if (!field) return

      const fieldLower = field.toLowerCase()
      terms.forEach(term => {
        // Exact match gets highest score
        if (fieldLower === term) {
          score += 100
        }
        // Starts with term
        else if (fieldLower.startsWith(term)) {
          score += 50
        }
        // Contains term
        else if (fieldLower.includes(term)) {
          score += 25
        }
        // Fuzzy match (partial word)
        else if (fieldLower.includes(term.slice(0, -1)) || fieldLower.includes(term.slice(1))) {
          score += 10
        }
      })
    })

    return score
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedFilters])

  const getTypeIcon = (type: string) => {
    const icons = {
      project: "📁",
      ticket: "🎫",
      user: "👤",
      message: "💬"
    }
    return icons[type as keyof typeof icons] || "📄"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      project: "bg-primary/10 text-primary",
      ticket: "bg-green-100 text-green-800",
      user: "bg-purple-100 text-purple-800",
      message: "bg-yellow-100 text-yellow-800"
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatMetadata = (result: SearchResult) => {
    switch (result.type) {
      case 'project':
        return `${result.metadata.status} • ${result.metadata.stage} • ${result.metadata.type}`
      case 'ticket':
        return `${result.metadata.priority} • ${result.metadata.status} • ${result.metadata.type}`
      case 'user':
        return `${result.metadata.role} • ${result.metadata.active ? 'Active' : 'Inactive'}`
      case 'message':
        return `From ${result.metadata.sender} • ${new Date(result.metadata.date).toLocaleDateString()}`
      default:
        return ''
    }
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
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Global Search</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Find anything across your entire workspace - projects, tickets, users, and messages
            </p>
          </div>

          {/* Search Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 mb-8">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for projects, tickets, users, messages..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
                  >
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Search in:</span>
              {Object.entries(selectedFilters).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>

            {/* Search Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {isSearching ? "Searching..." : `${searchResults.length} results found`}
              </span>
              {searchQuery && !isSearching && (
                <span>for "{searchQuery}"</span>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {/* Results by Type */}
              {['project', 'ticket', 'user', 'message'].map(type => {
                const typeResults = searchResults.filter(result => result.type === type)
                if (typeResults.length === 0) return null

                return (
                  <div key={type} className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 overflow-hidden">
                    <div className="p-6 border-b border-border/50">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(type)}</span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}s
                        <span className="text-sm font-normal text-muted-foreground">
                          ({typeResults.length} results)
                        </span>
                      </h3>
                    </div>

                    <div className="divide-y divide-border/50">
                      {typeResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-6 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => navigate(result.url)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                  {result.title}
                                </h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                                  {result.type}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-3 leading-relaxed">
                                {result.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatMetadata(result)}</span>
                                <span className="text-xs bg-muted/50 px-2 py-1 rounded">
                                  Relevance: {result.relevance}
                                </span>
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* No Results */}
          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSearchQuery("")}
                  className="btn-outline"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => setSelectedFilters({
                    projects: true,
                    tickets: true,
                    users: true,
                    messages: true
                  })}
                  className="btn-primary"
                >
                  Search Everything
                </button>
              </div>
            </div>
          )}

          {/* Search Tips */}
          {!searchQuery && (
            <div className="bg-secondary/10 dark:bg-secondary/20 rounded-xl border border-secondary/20 dark:border-secondary/30 p-6">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-3">
                🔍 Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground dark:text-muted-foreground">
                <div>
                  <h4 className="font-medium mb-2">What you can search:</h4>
                  <ul className="space-y-1">
                    <li>• Project names and descriptions</li>
                    <li>• Ticket titles and content</li>
                    <li>• User names and roles</li>
                    <li>• Message subjects and content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Advanced features:</h4>
                  <ul className="space-y-1">
                    <li>• Filter by content type</li>
                    <li>• Relevance-based ranking</li>
                    <li>• Real-time search results</li>
                    <li>• Direct navigation to results</li>
                  </ul>
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