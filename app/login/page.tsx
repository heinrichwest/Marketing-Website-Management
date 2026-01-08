import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Link, useNavigate } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      showToast("Please fill in all fields", "error")
      return
    }

    setIsSubmitting(true)
    try {
      await signIn(email, password)
      showToast("Signing in...", "success")
      // Navigation will happen automatically when auth state changes
      navigate("/dashboard")
    } catch (error: any) {
      // Handle Firebase Auth errors
      let errorMessage = "Failed to sign in. Please try again."
      
      if (error.message) {
        if (error.message.includes("auth/user-not-found") || error.message.includes("auth/wrong-password")) {
          errorMessage = "Invalid email or password"
        } else if (error.message.includes("auth/invalid-email")) {
          errorMessage = "Invalid email address"
        } else if (error.message.includes("auth/too-many-requests")) {
          errorMessage = "Too many failed attempts. Please try again later."
        } else if (error.message.includes("auth/user-disabled")) {
          errorMessage = "This account has been disabled"
        } else {
          errorMessage = error.message
        }
      }
      
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          {/* Simple Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your account</p>
          </div>

          <div className="card">
            {/* Simple Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground mb-3">Professional Project Management</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-lg">🛡️ Secure</span>
              <span className="text-lg">✓ Collaborative</span>
              <span className="text-lg">⚡ Efficient</span>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
