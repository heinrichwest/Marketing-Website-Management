"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useNavigate, Link } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"

export default function ClientLoginPage() {
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
      showToast("Welcome to Client Portal!", "success")
      navigate("/client-portal/dashboard")
    } catch (error: any) {
      let errorMessage = "Failed to sign in. Please try again."

      if (error.message) {
        if (error.message.includes("auth/user-not-found") || error.message.includes("auth/wrong-password")) {
          errorMessage = "Invalid email or password"
        } else if (error.message.includes("auth/invalid-email")) {
          errorMessage = "Invalid email address"
        }
      }

      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Portal</h1>
          <p className="text-muted-foreground">Access your project updates and files</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark mt-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Site
          </Link>
        </div>

        {/* Simple Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border/50 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
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
              className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-accent/20"
            >
              {isSubmitting || loading ? "Signing in..." : "Access Client Portal"}
            </button>
          </form>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link to="/contact" className="text-primary font-semibold hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}