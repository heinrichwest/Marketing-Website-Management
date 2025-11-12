"use client"
import { useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import vouchersData from "@/data/vouchers.json"
import { useToast, ToastContainer } from "@/components/toast"

export default function VoucherDetailPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  const { toasts, showToast } = useToast()
  const voucher = vouchersData.find((v) => v.id === Number(params.id))
  const relatedVouchers = vouchersData
    .filter((v) => v.category === voucher?.category && v.id !== voucher?.id)
    .slice(0, 3)

  if (!voucher) {
    return (
      <>
        <Navbar />
        <div className="container py-12">
          <p className="text-center text-lg text-muted-foreground">Voucher not found</p>
        </div>
        <Footer />
      </>
    )
  }

  const buyerPrice = Math.round(voucher.faceValue * 0.9)
  const savings = voucher.faceValue - buyerPrice

  const handleBuyNow = () => {
    showToast(`Added R${buyerPrice} ${voucher.brand} voucher to cart!`, "success")
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <Link href="/vouchers" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Vouchers
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Left - Voucher Info */}
            <div>
              <div className="card text-center mb-6">
                <div className="text-8xl mb-6">{voucher.logo}</div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{voucher.brand}</h1>
                <p className="text-lg text-muted-foreground mb-4">{voucher.category}</p>
                {voucher.verified && <span className="badge badge-success text-sm">✓ Verified & Safe</span>}
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">{voucher.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(voucher.expiryDate).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right - Pricing & CTA */}
            <div>
              <div className="card sticky top-24 space-y-6">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Face Value</p>
                  <p className="text-5xl font-bold text-foreground">R{voucher.faceValue}</p>
                </div>

                <div className="border-t border-b border-border py-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buyer Price (90%)</span>
                    <span className="font-bold text-lg text-foreground">R{buyerPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You Save (10%)</span>
                    <span className="font-bold text-lg text-success">R{savings}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button onClick={handleBuyNow} className="w-full btn-primary py-3 font-bold text-lg">
                    Buy Now - R{buyerPrice}
                  </button>
                  <button className="w-full btn-secondary py-3 font-bold">Add to Wishlist</button>
                </div>

                <div className="bg-muted rounded p-4">
                  <p className="text-sm text-muted-foreground mb-2">How it works:</p>
                  <ol className="text-sm text-foreground space-y-1">
                    <li>1. Purchase the voucher</li>
                    <li>2. Receive code</li>
                    <li>3. Redeem with the brand</li>
                  </ol>
                </div>

                <div className="bg-primary/10 rounded p-4">
                  <p className="text-sm text-primary font-semibold">
                    ✓ Buyer protection guaranteed - 100% safe transaction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Vouchers */}
          {relatedVouchers.length > 0 && (
            <section className="border-t border-border pt-16">
              <h2 className="text-3xl font-bold mb-8">Related Vouchers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedVouchers.map((related) => (
                  <Link
                    key={related.id}
                    href={`/voucher/${related.id}`}
                    className="card hover:shadow-lg hover:border-primary transition cursor-pointer group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition">{related.logo}</div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{related.brand}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{related.category}</p>
                    <p className="text-2xl font-bold text-primary">R{Math.round(related.faceValue * 0.9)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <Footer />
    </>
  )
}
