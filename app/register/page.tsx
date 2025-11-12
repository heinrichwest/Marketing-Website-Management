"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast, ToastContainer } from "@/components/toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toasts, showToast } = useToast()
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error")
      return
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }

    if (!agreeTerms) {
      showToast("Please agree to terms and conditions", "error")
      return
    }

    showToast(`Welcome to VoucherTrade! Registered as ${userType}.`, "success")
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted py-12">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join VoucherTrade and start buying or selling vouchers</p>
          </div>

          <div className="card">
            {/* User Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-4">
                How do you want to use VoucherTrade?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType("buyer")}
                  className={`p-6 rounded-lg border-2 transition text-center ${
                    userType === "buyer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">🛍️</div>
                  <h3 className="font-bold text-foreground mb-1">Buyer</h3>
                  <p className="text-sm text-muted-foreground">Save money on favorite brands</p>
                </button>

                <button
                  onClick={() => setUserType("seller")}
                  className={`p-6 rounded-lg border-2 transition text-center ${
                    userType === "seller" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">💰</div>
                  <h3 className="font-bold text-foreground mb-1">Seller</h3>
                  <p className="text-sm text-muted-foreground">Sell unwanted vouchers</p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

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
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 123 456 7890"
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

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-foreground">
                    I agree to VoucherTrade's{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full btn-primary py-3 font-bold text-lg">
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
