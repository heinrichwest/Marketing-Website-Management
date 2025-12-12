"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/types"
import RoleBadge from "./role-badge"

const ROLES: { value: UserRole; label: string; description: string }[] = [
  {
    value: "admin",
    label: "ADMIN",
    description: "Full system access and management",
  },
  {
    value: "web_developer",
    label: "WEB DEVELOPER",
    description: "Manage projects and tickets",
  },
  {
    value: "social_media_coordinator",
    label: "SOCIAL MEDIA COORDINATOR",
    description: "Manage social media and analytics",
  },
  {
    value: "client",
    label: "CLIENT",
    description: "View projects and create tickets",
  },
]

export default function RoleSwitcher({ className }: { className?: string }) {
  const { user, switchRole } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole)
    setIsOpen(false)

    // Redirect to appropriate dashboard based on role
    if (newRole === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition ${className}`}
      >
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01"
          />
        </svg>
        <span className="text-sm font-medium text-foreground">Switch Role</span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-border z-50 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#1e2875] to-[#2a3488] text-white">
              <h3 className="text-lg font-bold mb-1">Switch Role</h3>
              <p className="text-sm text-white/80">Current Role: {user.role.replace("_", " ").toUpperCase()}</p>
            </div>

            <div className="p-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSwitch(role.value)}
                  disabled={user.role === role.value}
                  className={`w-full text-left p-3 rounded-lg transition mb-2 ${
                    user.role === role.value
                      ? "bg-blue-50 border-2 border-[#1e2875] cursor-default"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#1e2875] text-sm">{role.label}</span>
                    {user.role === role.value && (
                      <span className="text-xs bg-[#1e2875] text-white px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </button>
              ))}

              <div className="mt-2 pt-2 border-t border-border">
                <Link
                  href="/switch-role"
                  className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gradient-to-r from-[#1e2875] to-[#2a3488] text-white hover:from-[#2a3488] hover:to-[#1e2875] transition"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01"
                    />
                  </svg>
                  <span className="font-semibold text-sm">View All Roles</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
