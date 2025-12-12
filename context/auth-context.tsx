"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole, User, Project, Ticket } from "@/types"
import { getUserById, getProjectsByUserId, initializeMockData } from "@/lib/mock-data"

interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  phone: string
}

interface AuthContextType {
  isSignedIn: boolean
  user: AuthUser | null
  signIn: (user: AuthUser) => void
  signOut: () => void
  switchRole: (newRole: UserRole) => void
  hasRole: (roles: UserRole[]) => boolean
  canAccessProject: (projectId: string) => boolean
  canManageTicket: (ticket: Ticket) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  // Initialize mock data on mount
  useEffect(() => {
    initializeMockData()
    // Try to restore session from localStorage
    const savedUser = localStorage.getItem("marketing_management_website_current_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsSignedIn(true)
      } catch (error) {
        console.error("Error restoring session:", error)
      }
    }
  }, [])

  const signIn = (authUser: AuthUser) => {
    setIsSignedIn(true)
    setUser(authUser)
    // Persist session
    localStorage.setItem("marketing_management_website_current_user", JSON.stringify(authUser))
  }

  const signOut = () => {
    setIsSignedIn(false)
    setUser(null)
    localStorage.removeItem("marketing_management_website_current_user")
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    const updatedUser = { ...user, role: newRole }
    setUser(updatedUser)
    localStorage.setItem("marketing_management_website_current_user", JSON.stringify(updatedUser))
  }

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const canAccessProject = (projectId: string): boolean => {
    if (!user) return false
    if (user.role === "admin") return true

    const projects = getProjectsByUserId(user.id, user.role)
    return projects.some((p) => p.id === projectId)
  }

  const canManageTicket = (ticket: Ticket): boolean => {
    if (!user) return false
    if (user.role === "admin") return true
    if (user.role === "web_developer" && ticket.assignedTo === user.id) return true
    if (user.role === "client" && ticket.createdBy === user.id) return true
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        signIn,
        signOut,
        switchRole,
        hasRole,
        canAccessProject,
        canManageTicket,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
