"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import vouchersData from "@/data/vouchers.json"
import categoriesData from "@/data/categories.json"

interface RetailerTile {
  brand: string
  logo: string
  category: string
  voucherCount: number
}

export default function VouchersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const uniqueRetailers: RetailerTile[] = useMemo(() => {
    const retailerMap = new Map<string, RetailerTile>()

    vouchersData.forEach((voucher) => {
      if (!retailerMap.has(voucher.brand)) {
        retailerMap.set(voucher.brand, {
          brand: voucher.brand,
          logo: voucher.logo,
          category: voucher.category,
          voucherCount: 0,
        })
      }
      const retailer = retailerMap.get(voucher.brand)!
      retailer.voucherCount += 1
    })

    return Array.from(retailerMap.values())
  }, [])

  const filteredRetailers = useMemo(() => {
    if (selectedCategory === "All") {
      return uniqueRetailers
    }
    return uniqueRetailers.filter((r) => r.category === selectedCategory)
  }, [uniqueRetailers, selectedCategory])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Browse Retailers</h1>
          <p className="text-muted-foreground mb-8">Select a retailer to view available vouchers and save 10%</p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-4">Filter by Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === "All" ? "bg-primary text-white" : "text-foreground hover:bg-background"
                    }`}
                  >
                    All Retailers
                  </button>
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat.name ? "bg-primary text-white" : "text-foreground hover:bg-background"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Retailers Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRetailers.length > 0 ? (
                  filteredRetailers.map((retailer) => (
                    <Link
                      key={retailer.brand}
                      href={`/vouchers/retailer/${encodeURIComponent(retailer.brand)}`}
                      className="group"
                    >
                      <div className="card h-full flex flex-col items-center justify-center hover:shadow-lg transition cursor-pointer p-8">
                        <div className="mb-6">
                          <Image
                            src={retailer.logo || "/placeholder.svg"}
                            alt={retailer.brand}
                            width={120}
                            height={120}
                            className="object-contain"
                          />
                        </div>

                        <h3 className="font-bold text-xl text-foreground mb-1 text-center">{retailer.brand}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{retailer.category}</p>

                        <div className="text-center">
                          <p className="text-lg font-semibold text-primary">
                            {retailer.voucherCount} {retailer.voucherCount === 1 ? "Voucher" : "Vouchers"}
                          </p>
                          <p className="text-sm text-success mt-2 group-hover:underline">View & Save 10% →</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground text-lg">No retailers found in this category</p>
                  </div>
                )}
              </div>

              <p className="text-center text-muted-foreground mt-8">
                Showing {filteredRetailers.length} retailer{filteredRetailers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
