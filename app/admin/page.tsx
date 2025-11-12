"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"

export default function AdminPage() {
  const { toasts, showToast } = useToast()
  const [filter, setFilter] = useState("all")

  // Mock verification queue data
  const pendingVouchers = [
    {
      id: 1,
      voucherId: "VCH-001",
      seller: "John M.",
      brand: "Takealot",
      value: 1000,
      status: "pending",
      uploadDate: "2025-11-01",
      description: "Takealot R1000 voucher, valid for all products",
    },
    {
      id: 2,
      voucherId: "VCH-002",
      seller: "Emma D.",
      brand: "Netflix",
      value: 500,
      status: "pending",
      uploadDate: "2025-11-02",
      description: "Netflix Premium 2-month subscription",
    },
    {
      id: 3,
      voucherId: "VCH-003",
      seller: "Alex P.",
      brand: "Spotify",
      value: 600,
      status: "approved",
      uploadDate: "2025-10-30",
      description: "Spotify Premium 3-month family plan",
    },
    {
      id: 4,
      voucherId: "VCH-004",
      seller: "Lisa R.",
      brand: "Checkers",
      value: 800,
      status: "rejected",
      uploadDate: "2025-10-28",
      description: "Checkers Food & Home voucher",
    },
    {
      id: 5,
      voucherId: "VCH-005",
      seller: "Chris B.",
      brand: "Pick n Pay",
      value: 700,
      status: "pending",
      uploadDate: "2025-11-02",
      description: "Pick n Pay shopping voucher",
    },
  ]

  const filteredVouchers = filter === "all" ? pendingVouchers : pendingVouchers.filter((v) => v.status === filter)

  const stats = {
    total: pendingVouchers.length,
    pending: pendingVouchers.filter((v) => v.status === "pending").length,
    approved: pendingVouchers.filter((v) => v.status === "approved").length,
    rejected: pendingVouchers.filter((v) => v.status === "rejected").length,
  }

  const handleApprove = (id: number) => {
    showToast(`Voucher ${id} approved successfully!`, "success")
  }

  const handleReject = (id: number) => {
    showToast(`Voucher ${id} rejected. Seller notified.`, "info")
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage voucher verification queue</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Pending</p>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-success">{stats.approved}</p>
              <p className="text-xs text-muted-foreground mt-2">This week</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Rejected</p>
              <p className="text-3xl font-bold text-danger">{stats.rejected}</p>
              <p className="text-xs text-muted-foreground mt-2">Failed verification</p>
            </div>

            <div className="card">
              <p className="text-muted-foreground text-sm mb-2">Total Processed</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="card mb-6">
            <div className="flex gap-4 flex-wrap">
              {[
                { id: "all", label: "All", count: stats.total },
                { id: "pending", label: "Pending", count: stats.pending },
                { id: "approved", label: "Approved", count: stats.approved },
                { id: "rejected", label: "Rejected", count: stats.rejected },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${
                    filter === tab.id ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Verification Queue Table */}
          <div className="card overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Voucher ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Seller</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Brand</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Value</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVouchers.map((voucher, idx) => (
                    <tr
                      key={voucher.id}
                      className={`border-b border-border hover:bg-muted/50 transition ${
                        voucher.status === "pending" ? "bg-warning/5" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-foreground font-mono text-sm">{voucher.voucherId}</td>
                      <td className="py-4 px-6 text-foreground">{voucher.seller}</td>
                      <td className="py-4 px-6 text-foreground font-semibold">{voucher.brand}</td>
                      <td className="py-4 px-6 text-foreground">R{voucher.value}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`badge ${
                            voucher.status === "pending"
                              ? "bg-warning/10 text-warning"
                              : voucher.status === "approved"
                                ? "badge-success"
                                : "bg-danger/10 text-danger"
                          }`}
                        >
                          {voucher.status === "approved"
                            ? "✓ Approved"
                            : voucher.status === "rejected"
                              ? "✗ Rejected"
                              : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{voucher.uploadDate}</td>
                      <td className="py-4 px-6">
                        {voucher.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(voucher.id)}
                              className="px-3 py-1 rounded text-white bg-success hover:bg-success/90 text-sm transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(voucher.id)}
                              className="px-3 py-1 rounded text-white bg-danger hover:bg-danger/90 text-sm transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button className="text-primary hover:underline text-sm">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expandable Details Example */}
          <div className="card mt-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Quick Review</h2>

            {pendingVouchers
              .filter((v) => v.status === "pending")
              .slice(0, 1)
              .map((voucher) => (
                <div key={voucher.id} className="border border-border rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Voucher ID</p>
                      <p className="font-mono text-sm text-foreground">{voucher.voucherId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Seller</p>
                      <p className="font-semibold text-foreground">{voucher.seller}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Value</p>
                      <p className="text-2xl font-bold text-primary">R{voucher.value}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase mb-2">Description</p>
                    <p className="text-foreground">{voucher.description}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(voucher.id)}
                      className="flex-1 px-6 py-3 rounded-lg bg-success text-white font-bold hover:bg-success/90 transition"
                    >
                      ✓ Approve Voucher
                    </button>
                    <button
                      onClick={() => handleReject(voucher.id)}
                      className="flex-1 px-6 py-3 rounded-lg bg-danger text-white font-bold hover:bg-danger/90 transition"
                    >
                      ✗ Reject & Notify
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
