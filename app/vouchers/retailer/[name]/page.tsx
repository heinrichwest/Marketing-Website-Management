"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import vouchersData from "@/data/vouchers.json"

export default function RetailerVouchersPage() {
  const params = useParams()
  const retailerName = decodeURIComponent(params.name as string)
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("price-asc")

  const retailerVouchers = useMemo(() => {
    const filtered = vouchersData.filter((v) => v.brand === retailerName)

    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.faceValue - b.faceValue)
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.faceValue - a.faceValue)
    }

    return filtered
  }, [retailerName, sortBy])

  const retailerInfo = retailerVouchers[0]
  const buyerPrice = (faceValue: number) => Math.round(faceValue * 0.9)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <Link href="/vouchers" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Retailers
          </Link>

          {retailerInfo && (
            <div className="mb-8 p-6 bg-muted rounded-lg flex items-center gap-6">
              <Image
                src={retailerInfo.logo || "/placeholder.svg"}
                alt={retailerName}
                width={100}
                height={100}
                className="object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold mb-2">{retailerName}</h1>
                <p className="text-muted-foreground text-lg">{retailerInfo.category}</p>
              </div>
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Vouchers</h2>
            <div>
              <label className="text-sm text-muted-foreground mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded border border-border text-foreground"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailerVouchers.length > 0 ? (
              retailerVouchers.map((voucher) => (
                <div key={voucher.id} className="card hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-16 flex items-center">
                      <Image
                        src={voucher.logo || "/placeholder.svg"}
                        alt={voucher.brand}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    {voucher.verified && <span className="badge badge-success text-xs">Verified</span>}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{voucher.category}</p>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary mb-1">R{buyerPrice(voucher.faceValue)}</p>
                    <p className="text-sm text-muted-foreground line-through">Regular R{voucher.faceValue}</p>
                    <p className="text-sm font-semibold text-success mt-1">Save 10%</p>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Expires: {new Date(voucher.expiryDate).toLocaleDateString()}
                  </p>

                  <Link href={`/voucher/${voucher.id}`} className="block text-center w-full btn-primary">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground text-lg">No vouchers available for this retailer</p>
              </div>
            )}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Showing {retailerVouchers.length} voucher{retailerVouchers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
