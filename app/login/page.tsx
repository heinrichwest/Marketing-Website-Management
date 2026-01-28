import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { useNavigate } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { signIn, loading, resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)

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
    } catch (error: unknown) {
      // Handle Firebase Auth errors
      let errorMessage = "Failed to sign in. Please try again."

      if (error instanceof Error && error.message) {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resetEmail) {
      showToast("Please enter your email address", "error")
      return
    }

    setIsResetting(true)
    try {
      await resetPassword(resetEmail)
      showToast("Password reset email sent! Check your inbox.", "success")
      setShowForgotPassword(false)
      setResetEmail("")
    } catch (error: unknown) {
      let errorMessage = "Failed to send reset email. Please try again."
      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      showToast(errorMessage, "error")
    } finally {
      setIsResetting(false)
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

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email)
                    setShowForgotPassword(true)
                  }}
                  className="text-sm text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot password?
                </button>
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-muted-foreground mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-3 px-4 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
