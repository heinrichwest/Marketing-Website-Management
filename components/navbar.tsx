"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { isSignedIn, userEmail, userType, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <span className="text-3xl">💳</span> VoucherTrade
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/vouchers" className="text-foreground hover:text-primary transition">
            Browse Vouchers
          </Link>
          <Link href="/upload" className="text-foreground hover:text-primary transition">
            Sell Voucher
          </Link>
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-semibold text-foreground">{userEmail}</p>
                <p className="text-xs text-muted-foreground capitalize">{userType} Account</p>
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
