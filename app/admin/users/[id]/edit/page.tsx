"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getUserById, updateUser } from "@/lib/mock-data"
import type { UserRole, User } from "@/types"

export default function EditUserPage() {
  const { isSignedIn, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "client" as UserRole,
    isActive: true,
    changePassword: false,
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    } else if (user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [isSignedIn, user, router])

  useEffect(() => {
    if (userId) {
      const userData = getUserById(userId)
      if (userData) {
        setCurrentUser(userData)
        setFormData({
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          isActive: userData.isActive,
          changePassword: false,
          newPassword: "",
          confirmPassword: "",
        })
        setIsLoading(false)
      } else {
        router.push("/admin/users")
      }
    }
  }, [userId, router])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading || !currentUser) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-muted flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.changePassword) {
      if (!formData.newPassword || !formData.confirmPassword) {
        setError("Please enter and confirm the new password")
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      updateUser(userId, {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
        ...(formData.changePassword && { password: formData.newPassword }),
      })

      router.push("/admin/users")
    } catch (err) {
      setError("Failed to update user. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/admin/users"
                className="text-primary hover:text-primary/80 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold text-foreground">Edit User</h1>
            </div>
            <p className="text-muted-foreground">Update user information and role assignment</p>
          </div>

          {/* Form */}
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="card">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                    placeholder="+27821234567"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                    required
                    disabled={currentUser.id === user.id}
                  >
                    <option value="client">Client - Can view projects and create tickets</option>
                    <option value="web_developer">Web Developer - Can manage projects and tickets</option>
                    <option value="social_media_coordinator">
                      Social Media Coordinator - Can manage social media and analytics
                    </option>
                    <option value="admin">Admin - Full system access</option>
                  </select>
                  {currentUser.id === user.id && (
                    <p className="mt-2 text-sm text-amber-600">
                      You cannot change your own role
                    </p>
                  )}
                  {currentUser.id !== user.id && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select the appropriate role based on user responsibilities
                    </p>
                  )}
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 border border-border rounded"
                      disabled={currentUser.id === user.id}
                    />
                    <span className="text-sm font-medium text-foreground">
                      Active User (can sign in to the system)
                    </span>
                  </label>
                  {currentUser.id === user.id && (
                    <p className="mt-2 text-sm text-amber-600">
                      You cannot deactivate your own account
                    </p>
                  )}
                </div>

                {/* Change Password Section */}
                <div className="pt-6 border-t border-border">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={formData.changePassword}
                      onChange={(e) => setFormData({ ...formData, changePassword: e.target.checked })}
                      className="w-5 h-5 border border-border rounded"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Change Password
                    </span>
                  </label>

                  {formData.changePassword && (
                    <div className="space-y-4 ml-8">
                      {/* New Password */}
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                          placeholder="Enter new password (min. 6 characters)"
                          minLength={6}
                        />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                          className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                          placeholder="Re-enter new password"
                          minLength={6}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                <Link href="/admin/users" className="btn-outline">
                  Cancel
                </Link>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? "Updating User..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
