import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import { useAuth } from "../../../context/auth-context"
import { getMessagesByUserId, markMessageAsRead } from "../../../lib/mock-data"
import type { Message } from "../../../types"
import { formatRelativeTime } from "../../../lib/utils"

export default function AdminMessagesPage() {
  const { isSignedIn, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = "/login"
      return
    }
    if (!user || user.role !== "admin") {
      window.location.href = "/dashboard"
      return
    }
  }, [isSignedIn, user])

  // Refresh when messages are updated
  useEffect(() => {
    const handleMessagesUpdated = () => setRefreshKey(prev => prev + 1)
    window.addEventListener('messagesUpdated', handleMessagesUpdated)
    return () => window.removeEventListener('messagesUpdated', handleMessagesUpdated)
  }, [])

  useEffect(() => {
    if (user) {
      const userMessages = getMessagesByUserId(user.id)
      setMessages(userMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
  }, [user, refreshKey])

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId)
    setRefreshKey(prev => prev + 1)
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Messages Inbox
                  {unreadCount > 0 && (
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-primary-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                </h1>
                <p className="text-muted-foreground">Notifications and communications from team members</p>
              </div>
              <Link to="/admin/dashboard" className="btn-outline hover:border-accent hover:text-accent">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`card p-6 ${!message.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {message.subject}
                        </h3>
                        {!message.isRead && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {message.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>From: {message.senderId ? 'Developer' : 'System'}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(message.createdAt)}</span>
                        {message.projectId && (
                          <>
                            <span>•</span>
                            <Link
                              to={`/admin/projects/${message.projectId}`}
                              className="text-primary hover:underline"
                            >
                              View Project
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/80"
                        >
                          Mark as Read
                        </button>
                      )}
                      {message.projectId && (
                        <Link
                          to={`/admin/projects/${message.projectId}`}
                          className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                        >
                          View Project
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No messages yet</h3>
                <p className="text-muted-foreground">
                  Messages from developers and team notifications will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}