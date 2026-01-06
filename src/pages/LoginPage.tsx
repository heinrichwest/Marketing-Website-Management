import type React from "react"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Link, useNavigate } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { signIn, loading, isSignedIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to dashboard when user becomes signed in
  useEffect(() => {
    if (isSignedIn && !loading) {
      navigate("/dashboard")
    }
  }, [isSignedIn, loading, navigate])

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
      // Navigation will happen automatically via useEffect when auth state changes
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Sign In</h1>
            <p className="text-muted-foreground">Access your Marketing Management Website account</p>
          </div>

          <div className="card">
            {/* Test Credentials Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Test Accounts:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li><strong>Administrator:</strong> admin@system.com / admin123</li>
                <li><strong>Web Developer:</strong> dev@system.com / dev123</li>
                <li><strong>Web Developer:</strong> jane.dev@system.com / dev123</li>
                <li><strong>Social Media Coordinator:</strong> social@system.com / social123</li>
                <li><strong>Client:</strong> client@system.com / client123</li>
                <li><strong>Client:</strong> client2@company.com / client123</li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-foreground">Remember me</span>
                </label>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || loading}
                className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-3 font-semibold text-foreground hover:bg-muted transition">
                <span>🔵</span> Continue with Google
              </button>

            </div>

            {/* Signup Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
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
