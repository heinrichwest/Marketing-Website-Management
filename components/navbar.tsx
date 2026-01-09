import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { getUnreadMessagesByUserId } from "@/lib/mock-data"
import RoleBadge from "./role-badge"
import { useState, useEffect } from "react"

// Mock notification count (in real app, this would come from a notifications API)
const getUnreadNotificationsCount = (userId: string) => {
  // Fixed count for demo purposes (in production, this would be real data)
  return 2 // Fixed demo count
}

// Helper function to get the correct dashboard route for each role
const getDashboardRoute = (role: string) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "web_developer":
      return "/developer/dashboard"
    case "social_media_coordinator":
      return "/coordinator/dashboard"
    case "client":
      return "/client-portal/dashboard"
    default:
      return "/dashboard"
  }
}

export default function Navbar() {
  const { isSignedIn, user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (user) {
      const unread = getUnreadMessagesByUserId(user.id).length
      const notifications = getUnreadNotificationsCount(user.id)
      setUnreadCount(unread)
      setNotificationCount(notifications)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      // Still navigate even if signOut fails
      navigate("/login")
    }
  }



    return (
      <>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <img src="/Logo.png" alt="Marketing Website Logo" className="h-10 w-auto" />
            <span>Marketing Website</span>
          </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Navigation links can be added here if needed */}
        </div>

        {/* Role-specific navigation - consistent layout */}
        <div className="hidden md:flex items-center gap-6">
          {isSignedIn && user && (
            <>
              {/* Primary Role Action */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {user.role === "admin" && "Admin"}
                  {user.role === "web_developer" && "Dev"}
                  {user.role === "social_media_coordinator" && "Coord"}
                  {user.role === "client" && "Client"}
                </span>
                <span className="text-foreground/50">|</span>
              </div>


            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && user ? (
             <div className="flex items-center gap-4">
              {/* Role-specific tool dropdowns */}
              {user.role === "admin" && (
                <div className="relative group">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Management Tools"
                  >
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                       <Link to="/search" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Search
                       </Link>
                       <Link to="/calendar" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Calendar
                       </Link>
                       <Link to="/time-tracking" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Time Tracking
                       </Link>
                       <Link to="/reports" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Reports
                       </Link>
                       <div className="border-t border-border my-2"></div>
                       <Link to="/ai-insights" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         AI Insights
                       </Link>
                       <Link to="/integrations" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Integrations
                       </Link>
                       <Link to="/automation" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Automation
                       </Link>
                       <Link to="/templates" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Templates
                       </Link>
                    </div>
                  </div>
                </div>
              )}

              {user.role === "web_developer" && (
                <div className="relative group">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Developer Tools"
                  >
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                       <Link to="/search" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Search
                       </Link>
                       <Link to="/calendar" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Calendar
                       </Link>
                       <Link to="/time-tracking" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Time Tracking
                       </Link>
                    </div>
                  </div>
                </div>
              )}

              {user.role === "social_media_coordinator" && (
                <div className="relative group">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Coordinator Tools"
                  >
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                   <div className="py-2">
                        <Link to="/search" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                          Search
                        </Link>
                        <Link to="/calendar" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                          Calendar
                        </Link>
                        <Link to="/analytics" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                          Analytics
                        </Link>
                        <Link to="/tickets" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                          Tickets
                        </Link>
                     </div>
                  </div>
                </div>
              )}

              {user.role === "client" && (
                <div className="relative group">
                  <button
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Support Tools"
                  >
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v6m0 6v6m6-9h-6m-6 3H3m6 3h6" />
                    </svg>
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                       <Link to="/client-portal/files" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Files
                       </Link>
                       <Link to="/messages" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Messages
                       </Link>
                       <Link to="/client-portal/feedback" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition text-center">
                         Feedback
                       </Link>
                    </div>
                  </div>
                </div>
              )}
               
               {/* Messages Icon */}
              <Link
                to="/messages"
                className="p-2 rounded-lg hover:bg-muted transition-colors relative"
                title={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold min-w-[20px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
               </Link>

               <div className="text-sm text-right">
                 <p className="font-semibold text-foreground">{user.fullName}</p>
               </div>

               <button onClick={handleSignOut} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
         </div>
       </div>
     </nav>
     </>
   )
}
