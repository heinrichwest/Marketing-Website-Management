"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { isSignedIn, userEmail, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("my-vouchers")
  const [isLoading, setIsLoading] = useState(true)

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [isSignedIn, router])

  if (isLoading || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Mock data
  const myVouchers = [
    { id: 1, brand: "Takealot", value: 1000, status: "approved", uploadDate: "2025-10-15" },
    { id: 2, brand: "Netflix", value: 500, status: "pending", uploadDate: "2025-11-01" },
    { id: 3, brand: "Uber Eats", value: 750, status: "approved", uploadDate: "2025-10-20" },
  ]

  const sales = [
    { id: 1, buyer: "Thabo M.", brand: "Takealot", value: 1000, date: "2025-11-02", amount: 900 },
    { id: 2, buyer: "Nandi K.", brand: "Netflix", value: 500, date: "2025-11-01", amount: 450 },
    { id: 3, buyer: "David P.", brand: "Uber Eats", value: 750, date: "2025-10-28", amount: 675 },
  ]

  const payouts = [
    { id: 1, date: "2025-11-01", amount: 2025, status: "completed", method: "EFT" },
    { id: 2, date: "2025-10-15", amount: 1575, status: "completed", method: "EFT" },
  ]

  const stats = {
    totalListings: myVouchers.length,
    totalSales: sales.length,
    totalEarnings: sales.reduce((sum, s) => sum + s.amount, 0),
    pendingPayout: 2025,
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your account overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Listings</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalListings}</p>
              <p className="text-xs text-muted-foreground mt-2">Approved & waiting for buyers</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Sales This Month</p>
              <p className="text-3xl font-bold text-primary">{stats.totalSales}</p>
              <p className="text-xs text-muted-foreground mt-2">Vouchers purchased by buyers</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-success">R{stats.totalEarnings}</p>
              <p className="text-xs text-muted-foreground mt-2">From completed sales only</p>
            </div>

            <div className="card bg-primary/5 border border-primary/20">
              <p className="text-muted-foreground text-sm mb-2">Pending Payout</p>
              <p className="text-3xl font-bold text-primary">R{stats.pendingPayout}</p>
              <p className="text-xs text-muted-foreground mt-2">From sold vouchers</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="flex gap-8 border-b border-border mb-6 flex-wrap">
              {[
                { id: "my-vouchers", label: "My Vouchers" },
                { id: "sales", label: "Sales" },
                { id: "payouts", label: "Payouts" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 font-semibold transition border-b-2 ${
                    activeTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {/* My Vouchers Tab */}
              {activeTab === "my-vouchers" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Your Listed Vouchers</h2>
                    <Link href="/upload" className="btn-primary text-sm">
                      + Upload New Voucher
                    </Link>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-muted-foreground">
                      You will earn 70% of the face value when a buyer purchases your voucher.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Value</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Uploaded</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myVouchers.map((voucher) => (
                          <tr key={voucher.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-4 px-4 text-foreground font-semibold">{voucher.brand}</td>
                            <td className="py-4 px-4 text-foreground">R{voucher.value}</td>
                            <td className="py-4 px-4">
                              <span
                                className={`badge ${
                                  voucher.status === "approved" ? "badge-success" : "bg-warning/10 text-warning"
                                }`}
                              >
                                {voucher.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-muted-foreground text-sm">{voucher.uploadDate}</td>
                            <td className="py-4 px-4">
                              <button className="text-primary hover:underline text-sm">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sales Tab */}
              {activeTab === "sales" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Recent Sales</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Buyer</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Value</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">You Received</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-border hover:bg-muted/50">
                            <td className="py-4 px-4 text-foreground font-semibold">{sale.buyer}</td>
                            <td className="py-4 px-4 text-foreground">{sale.brand}</td>
                            <td className="py-4 px-4 text-foreground">R{sale.value}</td>
                            <td className="py-4 px-4 text-success font-semibold">R{sale.amount}</td>
                            <td className="py-4 px-4 text-muted-foreground text-sm">{sale.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payouts Tab */}
              {activeTab === "payouts" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Payout History</h2>

                  <div className="space-y-4">
                    {payouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div>
                          <p className="font-semibold text-foreground">R{payout.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {payout.date} • {payout.method}
                          </p>
                        </div>
                        <span className="badge badge-success">{payout.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Pending Payout: </span>R{stats.pendingPayout}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Will be processed to your bank account within 5-7 business days
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Account Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Email Address</p>
                        <p className="text-sm text-muted-foreground">seller@example.com</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Phone Number</p>
                        <p className="text-sm text-muted-foreground">+27 123 456 7890</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Bank Account</p>
                        <p className="text-sm text-muted-foreground">••• ••• 1234</p>
                      </div>
                      <button className="btn-outline text-sm">Update</button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                      </div>
                      <button className="btn-outline text-sm">Change</button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button onClick={handleSignOut} className="btn-outline text-danger">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
