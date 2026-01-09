import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

export default function TicketsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user) return

    // Redirect to role-appropriate tickets page
    switch (user.role) {
      case "admin":
        navigate("/admin/tickets")
        break
      case "web_developer":
        navigate("/developer/tickets")
        break
      case "social_media_coordinator":
        navigate("/coordinator/tickets")
        break
      case "client":
        navigate("/client/tickets")
        break
      default:
        navigate("/dashboard")
    }
  }, [user, isSignedIn, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

// Analytics redirect page
export function AnalyticsPage() {
  const { user, isSignedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login")
      return
    }

    if (!user) return

    // Redirect to role-appropriate analytics page
    switch (user.role) {
      case "admin":
        navigate("/admin/analytics")
        break
      case "web_developer":
        navigate("/developer/analytics")
        break
      case "social_media_coordinator":
        navigate("/coordinator/analytics")
        break
      case "client":
        navigate("/client/analytics")
        break
      default:
        navigate("/dashboard")
    }
  }, [user, isSignedIn, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}