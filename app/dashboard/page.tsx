"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { isSignedIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
      return
    }

    // Redirect to role-specific dashboard
    if (user) {
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "web_developer":
          router.push("/developer/dashboard")
          break
        case "social_media_coordinator":
          router.push("/coordinator/dashboard")
          break
        case "client":
          router.push("/client/dashboard")
          break
        default:
          router.push("/")
      }
    }
  }, [isSignedIn, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  )
}
