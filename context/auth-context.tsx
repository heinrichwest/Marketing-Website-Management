"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  isSignedIn: boolean
  userType: "buyer" | "seller" | null
  userEmail: string | null
  signIn: (email: string, userType: "buyer" | "seller") => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userType, setUserType] = useState<"buyer" | "seller" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const signIn = (email: string, type: "buyer" | "seller") => {
    setIsSignedIn(true)
    setUserEmail(email)
    setUserType(type)
  }

  const signOut = () => {
    setIsSignedIn(false)
    setUserEmail(null)
    setUserType(null)
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, userType, userEmail, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
