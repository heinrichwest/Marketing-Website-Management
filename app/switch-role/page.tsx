"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { UserRole } from "@/types"

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: "admin",
    label: "ADMIN",
    description: "Full system access - Manage all projects, users, and system settings",
  },
  {
    value: "web_developer",
    label: "WEB DEVELOPER",
    description: "Manage assigned projects, handle tickets, and update project status",
  },
  {
    value: "social_media_coordinator",
    label: "SOCIAL MEDIA COORDINATOR",
    description: "Manage social media analytics, campaigns, and content for assigned projects",
  },
  {
    value: "client",
    label: "CLIENT",
    description: "View your projects, create tickets, and track progress",
  },
]

export default function SwitchRolePage() {
  const { isSignedIn, user, switchRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    }
  }, [isSignedIn, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole)

    // Redirect to appropriate dashboard based on role
    setTimeout(() => {
      if (newRole === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }, 300)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-[#1e2875] mb-4">Switch Role</h1>
              <p className="text-lg text-muted-foreground">
                Currently signed in as <span className="font-semibold text-foreground">{user.fullName}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Current Role:{" "}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1e2875] text-white">
                  {user.role.replace("_", " ").toUpperCase()}
                </span>
              </p>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {ROLES.map((role) => {
                const isCurrentRole = user.role === role.value

                return (
                  <button
                    key={role.value}
                    onClick={() => !isCurrentRole && handleRoleSwitch(role.value)}
                    disabled={isCurrentRole}
                    className={`relative p-8 rounded-xl shadow-lg transition-all duration-300 text-left ${
                      isCurrentRole
                        ? "bg-gradient-to-br from-[#1e2875] to-[#2a3488] text-white cursor-default ring-4 ring-blue-300"
                        : "bg-white hover:shadow-2xl hover:-translate-y-1 hover:ring-2 hover:ring-[#1e2875]"
                    }`}
                  >
                    {/* Active Badge */}
                    {isCurrentRole && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          ACTIVE
                        </span>
                      </div>
                    )}

                    {/* Role Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        isCurrentRole ? "bg-white/20" : "bg-[#1e2875]/10"
                      }`}
                    >
                      {role.value === "admin" && (
                        <svg
                          className={`w-8 h-8 ${isCurrentRole ? "text-white" : "text-[#1e2875]"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      )}
                      {role.value === "web_developer" && (
                        <svg
                          className={`w-8 h-8 ${isCurrentRole ? "text-white" : "text-[#1e2875]"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      )}
                      {role.value === "social_media_coordinator" && (
                        <svg
                          className={`w-8 h-8 ${isCurrentRole ? "text-white" : "text-[#1e2875]"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      )}
                      {role.value === "client" && (
                        <svg
                          className={`w-8 h-8 ${isCurrentRole ? "text-white" : "text-[#1e2875]"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Role Title */}
                    <h2
                      className={`text-2xl font-bold mb-3 ${
                        isCurrentRole ? "text-white" : "text-[#1e2875]"
                      }`}
                    >
                      {role.label}
                    </h2>

                    {/* Role Description */}
                    <p className={`text-sm leading-relaxed ${isCurrentRole ? "text-white/90" : "text-muted-foreground"}`}>
                      {role.description}
                    </p>

                    {/* Click indicator for non-active roles */}
                    {!isCurrentRole && (
                      <div className="mt-6 flex items-center gap-2 text-[#1e2875] font-semibold text-sm">
                        <span>Click to switch</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Back to Dashboard */}
            <div className="text-center">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white shadow-md hover:shadow-lg transition text-[#1e2875] font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
