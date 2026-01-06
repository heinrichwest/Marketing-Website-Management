import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import RoleBadge from "./role-badge"

export default function Navbar() {
  const { isSignedIn, user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      // Still navigate even if signOut fails
      navigate("/")
    }
  }

  const is_admin_dashboard = pathname === "/admin/dashboard"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <img src="/Logo.png" alt="Logo" className="h-10 w-auto" />
          <span>Marketing Website</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {isSignedIn && (
            <>
              {user?.role === "social_media_coordinator" && (
                <Link to="/coordinator/projects" className="text-foreground hover:text-primary transition">
                  My Projects
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && user ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-semibold text-foreground">{user.fullName}</p>
                <RoleBadge role={user.role} className="mt-1" />
              </div>
              {user?.role === "admin" && (
                <Link
                  to="/admin/notifications"
                  className="p-2 rounded-lg hover:bg-muted transition-colors relative"
                  title="System Notifications"
                >
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m0 0v2a2 2 0 004 0v-2m-4-6h8" />
                  </svg>
                </Link>
              )}
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
  )
}
