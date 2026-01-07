"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getMessagesByUserId, markMessageAsRead, deleteMessage, addMessage, getUsers, getProjects } from "@/lib/mock-data"
import type { Message, User, Project } from "@/types"
import { format } from "date-fns"

export default function MessagesPage() {
  const { isSignedIn, user } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeForm, setComposeForm] = useState({
    recipientId: "",
    subject: "",
    content: "",
    projectId: "",
    isBroadcast: false
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
    }
  }, [isSignedIn, navigate])

  useEffect(() => {
    if (user) {
      setMessages(getMessagesByUserId(user.id))
      setUsers(getUsers())
      setProjects(getProjects())
    }
  }, [user])

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId)
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      if (deleteMessage(messageId)) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    }
  }

  const handleSendMessage = () => {
    if (!user || !composeForm.subject.trim() || !composeForm.content.trim()) return

    const newMessage: Message = {
      id: `message-${Date.now()}`,
      senderId: user.id,
      recipientId: composeForm.isBroadcast ? undefined : composeForm.recipientId || undefined,
      subject: composeForm.subject,
      content: composeForm.content,
      isRead: false,
      isBroadcast: composeForm.isBroadcast,
      projectId: composeForm.projectId || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addMessage(newMessage)
    setMessages(prev => [newMessage, ...prev])
    setComposeForm({ recipientId: "", subject: "", content: "", projectId: "", isBroadcast: false })
    setIsComposeOpen(false)
  }

  const getSenderName = (senderId: string) => {
    const sender = users.find(u => u.id === senderId)
    return sender ? sender.fullName : "Unknown"
  }

  const getRecipientName = (recipientId?: string) => {
    if (!recipientId) return "Everyone (Broadcast)"
    const recipient = users.find(u => u.id === recipientId)
    return recipient ? recipient.fullName : "Unknown"
  }

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : null
  }

  const unreadCount = messages.filter(msg =>
    !msg.isRead && (msg.recipientId === user?.id || msg.isBroadcast)
  ).length

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
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Messages</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Communicate with team members and clients
                {unreadCount > 0 && (
                  <span className="inline-flex items-center gap-2 ml-3 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                    </svg>
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="btn-primary px-6 py-3 self-start lg:self-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Compose Message
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">Messages</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                        selectedMessage?.id === message.id
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "hover:bg-muted/50 border-border/50 hover:border-primary/20"
                      } ${!message.isRead && (message.recipientId === user?.id || message.isBroadcast) ? "border-l-4 border-l-primary bg-secondary/10" : ""}`}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.isRead && (message.recipientId === user?.id || message.isBroadcast)) {
                          handleMarkAsRead(message.id)
                        }
                      }}
                    >
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-foreground truncate">
                             {message.senderId === user?.id ? "To: " : "From: "}
                             {message.senderId === user?.id
                               ? getRecipientName(message.recipientId)
                               : getSenderName(message.senderId)
                             }
                             {message.isBroadcast && " (Broadcast)"}
                           </p>
                           <p className="text-sm text-muted-foreground truncate font-medium">
                             {message.subject}
                           </p>
                         </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                           <div className="text-xs text-muted-foreground">
                             {format(message.createdAt, "MMM dd")}
                           </div>
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               handleDeleteMessage(message.id)
                             }}
                             className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                             title="Delete message"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         </div>
                       </div>
                      {!message.isRead && (message.recipientId === user?.id || message.isBroadcast) && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto flex-shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 shadow-sm">
                   <div className="mb-6">
                     <div className="flex items-center justify-between mb-4">
                       <h2 className="text-2xl font-bold text-foreground">{selectedMessage.subject}</h2>
                       <button
                         onClick={() => handleDeleteMessage(selectedMessage.id)}
                         className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                         title="Delete message"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </button>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>
                        {selectedMessage.senderId === user?.id ? "Sent to " : "From "}
                        {selectedMessage.senderId === user?.id
                          ? getRecipientName(selectedMessage.recipientId)
                          : getSenderName(selectedMessage.senderId)
                        }
                        {selectedMessage.isBroadcast && " (Broadcast)"}
                      </span>
                      <span>•</span>
                      <span>{format(selectedMessage.createdAt, "PPP 'at' p")}</span>
                    </div>
                    {getProjectName(selectedMessage.projectId) && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Project: {getProjectName(selectedMessage.projectId)}
                      </span>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-foreground text-lg leading-relaxed">{selectedMessage.content}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 p-8 shadow-sm flex items-center justify-center" style={{ minHeight: "400px" }}>
                  <div className="text-center">
                    <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-muted-foreground text-lg">Select a message to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compose Modal */}
          {isComposeOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-background rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">Compose New Message</h3>
                <p className="text-muted-foreground mb-6">
                  Send a message to team members or broadcast to everyone
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="broadcast"
                      checked={composeForm.isBroadcast}
                      onChange={(e) => setComposeForm(prev => ({
                        ...prev,
                        isBroadcast: e.target.checked,
                        recipientId: e.target.checked ? "" : prev.recipientId
                      }))}
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="broadcast" className="text-sm font-medium text-foreground">
                      Broadcast to all users
                    </label>
                  </div>

                  {!composeForm.isBroadcast && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Recipient
                      </label>
                      <select
                        value={composeForm.recipientId}
                        onChange={(e) => setComposeForm(prev => ({ ...prev, recipientId: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="">Select recipient</option>
                        {users
                          .filter(u => u.id !== user?.id && u.isActive)
                          .map(u => (
                            <option key={u.id} value={u.id}>
                              {u.fullName} ({u.role})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Related Project (Optional)
                    </label>
                    <select
                      value={composeForm.projectId}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, projectId: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Select project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter message subject"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      value={composeForm.content}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter your message"
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <button
                      onClick={() => setIsComposeOpen(false)}
                      className="btn-outline px-6 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!composeForm.subject.trim() || !composeForm.content.trim() || (!composeForm.isBroadcast && !composeForm.recipientId)}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Message
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