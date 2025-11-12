"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast, ToastContainer } from "@/components/toast"
import Link from "next/link"

export default function UploadPage() {
  const { toasts, showToast } = useToast()
  const [voucherValue, setVoucherValue] = useState<number>(500)
  const [voucherProvider, setVoucherProvider] = useState<string>("Takealot")
  const [voucherType, setVoucherType] = useState<string>("Digital Code")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const [proofFileName, setProofFileName] = useState<string>("")

  const buyerPrice = Math.round(voucherValue * 0.9)
  const sellerPayout = Math.round(voucherValue * 0.7)
  const platformFee = voucherValue - buyerPrice - (voucherValue - sellerPayout)

  const providers = [
    "Takealot",
    "Woolworths",
    "Checkers",
    "Pick n Pay",
    "Uber Eats",
    "Netflix",
    "Spotify",
    "Superbalist",
    "iTunes",
    "Amazon SA",
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFileName(file.name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (voucherValue < 500) {
      showToast("Minimum voucher value is R500", "error")
      return
    }
    if (voucherValue > 10000) {
      showToast("Maximum voucher value is R10,000", "error")
      return
    }
    if (!expiryDate) {
      showToast("Please select an expiry date", "error")
      return
    }
    if (!fileName) {
      showToast("Please upload a voucher image", "error")
      return
    }
    if (!proofFileName) {
      showToast("Please upload proof of purchase (till slip)", "error")
      return
    }
    if (!email || !phone) {
      showToast("Please provide email and phone number", "error")
      return
    }

    // Success
    showToast("Voucher submitted for review! You will be notified within 24 hours.", "success")

    // Reset form
    setVoucherValue(500)
    setVoucherProvider("Takealot")
    setVoucherType("Digital Code")
    setExpiryDate("")
    setDescription("")
    setEmail("")
    setPhone("")
    setFileName("")
    setProofFileName("")
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Sell Your Voucher</h1>
              <p className="text-muted-foreground">Get 70% of the voucher value when your voucher is purchased.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Voucher Details */}
              <div className="card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Voucher Details</h2>

                <div className="space-y-4">
                  {/* Provider */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Provider</label>
                    <select
                      value={voucherProvider}
                      onChange={(e) => setVoucherProvider(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      {providers.map((provider) => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Value (Rands)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-semibold text-base" style={{ fontFamily: 'Arial, sans-serif' }}></span>
                      <input
                        type="number"
                        min="500"
                        max="10000"
                        step="50"
                        value={voucherValue}
                        onChange={(e) => setVoucherValue(Number(e.target.value))}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>
                    {voucherValue < 500 && <p className="text-sm text-danger mt-2">Minimum value is R500</p>}
                    {voucherValue > 10000 && <p className="text-sm text-danger mt-2">Maximum value is R10,000</p>}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Voucher Type</label>
                    <select
                      value={voucherType}
                      onChange={(e) => setVoucherType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    >
                      <option>Digital Code</option>
                      <option>PDF</option>
                      <option>Card</option>
                    </select>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Valid for all products, no restrictions..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Proof Upload */}
              <div className="card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Verification Documents</h2>
                <p className="text-muted-foreground mb-6">
                  Please upload both the voucher image and proof of purchase (e.g., till slip, receipt).
                </p>

                <div className="space-y-6">
                  {/* Voucher Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Voucher Image</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">🎟️</div>
                      <p className="font-semibold text-foreground mb-2">Upload Voucher Image</p>
                      <p className="text-sm text-muted-foreground mb-4">Screenshot or image of the voucher code</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="file-upload" className="inline-block btn-primary cursor-pointer">
                        Choose File
                      </label>
                      {fileName && <p className="text-sm text-success mt-4">✓ {fileName} selected</p>}
                    </div>
                  </div>

                  {/* Proof of Purchase Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Proof of Purchase</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="font-semibold text-foreground mb-2">Upload Proof of Purchase</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Till slip, receipt, or invoice showing purchase
                      </p>
                      <input
                        type="file"
                        onChange={handleProofUpload}
                        className="hidden"
                        id="proof-upload"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="proof-upload" className="inline-block btn-primary cursor-pointer">
                        Choose File
                      </label>
                      {proofFileName && <p className="text-sm text-success mt-4">✓ {proofFileName} selected</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="card bg-primary/5 border border-primary/20">
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Earnings</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-foreground">Face Value</span>
                    <span className="font-bold text-foreground">R{voucherValue}</span>
                  </div>
                  <div className="border-t border-border my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">You Receive When Sold (70%)</span>
                    <span className="text-2xl font-bold text-success">R{sellerPayout}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Payment processed 5-7 days after purchase</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Contact Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 123 456 7890"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* T&Cs */}
              <div className="card bg-muted">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-foreground">
                    I confirm that the voucher is legitimate, unused, and I have the right to sell it. I understand that
                    VoucherTrade reserves the right to reject vouchers that don't meet standards.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full btn-primary py-4 text-lg font-bold">
                Submit Voucher for Review
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Questions?{" "}
                <Link href="#" className="text-primary hover:underline">
                  See seller FAQ
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
