import React, { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useToast, ToastContainer } from "@/components/toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toasts, showToast } = useToast()
  const { signIn, loading, isSignedIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isClientPortal = new URLSearchParams(location.search).get('portal') === 'client'

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
    } catch (error: unknown) {
      // Handle Firebase Auth errors
      let errorMessage = "Failed to sign in. Please try again."

      if (error instanceof Error && 'message' in error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'code' in error) {
        // Handle specific Firebase Auth error codes
        const errorObj = error as { code?: string }
        switch (errorObj.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email address."
            break
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again."
            break
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address."
            break
          case "auth/user-disabled":
            errorMessage = "This account has been disabled."
            break
          case "auth/too-many-requests":
            errorMessage = "Too many failed login attempts. Please try again later."
            break
          default:
            errorMessage = "Authentication failed. Please try again."
        }
         }

       showToast(errorMessage, "error");
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
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isClientPortal ? "Client Portal" : "Sign In"}
            </h1>
            <p className="text-muted-foreground">
              {isClientPortal ? "Welcome Back - Access your project updates and files" : "Access your Marketing Management Website account"}
            </p>
          </div>

          <div className="card">


            {/* Client Portal Credentials */}
            {isClientPortal && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm font-semibold text-accent mb-2">Client Portal Test Accounts:</p>
                <ul className="text-xs text-accent/80 space-y-1">
                  <li><strong>Client:</strong> client@system.com / client123</li>
                  <li><strong>Client:</strong> client2@company.com / client123</li>
                </ul>
                <p className="text-xs text-accent/60 mt-2">Don&apos;t have access? Contact support</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                 <input
                   id="email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="you@example.com"
                   className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                   required
                 />
               </div>

               <div>
                 <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">Password</label>
                 <input
                   id="password"
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                   required
                 />
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <input id="remember" type="checkbox" className="rounded" />
                   <label htmlFor="remember" className="text-sm text-foreground">Remember me</label>
                 </div>
                  <button
                    type="button"
                    onClick={() => showToast("Password reset feature coming soon. Please contact support.", "info")}
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
                <button
                  onClick={() => showToast("Google sign-in feature coming soon. Please use email/password for now.", "info")}
                  className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-3 font-semibold text-foreground hover:bg-muted transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

             </div>

             {/* Signup Link */}
             <p className="text-center mt-6 text-sm text-muted-foreground">
               Don&apos;t have an account?{" "}
               <Link to="/register" className="text-primary font-semibold hover:underline">
                 Sign up here
               </Link>
             </p>

             {/* Client Portal Back Link */}
             {isClientPortal && (
               <p className="text-center mt-4 text-sm text-muted-foreground">
                 <Link to="/" className="text-primary font-semibold hover:underline">
                   ← Back to Main Site
                 </Link>
               </p>
             )}
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground mb-3">Professional Project Management</p>
            <div className="flex items-center justify-center gap-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Secure
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Collaborative
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                Efficient
              </span>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
