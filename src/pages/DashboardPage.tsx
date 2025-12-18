import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { isSignedIn, user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Wait for auth to finish loading before making decisions
    if (loading) {
      return
    }

    if (!isSignedIn) {
      navigate("/login")
      return
    }

    // Redirect to role-specific dashboard
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard")
          break
        case "web_developer":
          navigate("/developer/dashboard")
          break
        case "social_media_coordinator":
          navigate("/coordinator/dashboard")
          break
        case "client":
          navigate("/client/dashboard")
          break
        default:
          navigate("/")
      }
    }
  }, [isSignedIn, user, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}
