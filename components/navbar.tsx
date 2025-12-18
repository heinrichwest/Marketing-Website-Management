import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import RoleBadge from "./role-badge"
import RoleSwitcher from "./role-switcher"

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
              <Link to="/dashboard" className="text-foreground hover:text-primary transition">
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin/projects" className="text-foreground hover:text-primary transition">
                  Projects
                </Link>
              )}
              {(user?.role === "web_developer" || user?.role === "client") && (
                <Link to="/tickets" className="text-foreground hover:text-primary transition">
                  Tickets
                </Link>
              )}
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
              <RoleSwitcher
                className={
                  is_admin_dashboard
                    ? "bg-white text-foreground hover:bg-gray-100 [&>svg]:text-foreground"
                    : ""
                }
              />
              <div className="text-sm text-right">
                <p className="font-semibold text-foreground">{user.fullName}</p>
                <RoleBadge role={user.role} className="mt-1" />
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
  )
}
