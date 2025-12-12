"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import RoleBadge from "./role-badge"
import RoleSwitcher from "./role-switcher"

export default function Navbar() {
  const { isSignedIn, user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const is_admin_dashboard = pathname === "/admin/dashboard"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <span className="text-3xl">🌐</span> Marketing Website
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {isSignedIn && (
            <>
              <Link href="/dashboard" className="text-foreground hover:text-primary transition">
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin/projects" className="text-foreground hover:text-primary transition">
                  Projects
                </Link>
              )}
              {(user?.role === "web_developer" || user?.role === "client") && (
                <Link href="/tickets" className="text-foreground hover:text-primary transition">
                  Tickets
                </Link>
              )}
              {user?.role === "social_media_coordinator" && (
                <Link href="/coordinator/projects" className="text-foreground hover:text-primary transition">
                  My Projects
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn && user ? (
            <div className="flex items-center gap-4">
              <RoleSwitcher
                className={
                  is_admin_dashboard
                    ? "bg-white text-black hover:bg-gray-100 [&>svg]:text-black"
                    : ""
                }
              />
              <div className="text-sm text-right">
                <p className="font-semibold text-foreground">{user.fullName}</p>
                <RoleBadge role={user.role} className="mt-1" />
              </div>
              <button onClick={handleSignOut} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
