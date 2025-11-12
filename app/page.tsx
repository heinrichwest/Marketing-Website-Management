import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import vouchersData from "@/data/vouchers.json"

export default function Home() {
  // Extract unique brands for the Popular Brands section
  const brands = Array.from(new Set(vouchersData.map((v) => ({ name: v.brand, logo: v.logo }))))

  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')",
            }}
          />

          {/* Content */}
          <div className="container text-center relative z-10">
            <h1 className="text-5xl font-bold mb-6 text-balance !text-white" style={{ color: '#ffffff' }}>Shop Smart. Trade Smarter. Save Big.</h1>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto text-balance">
              Get premium vouchers at up to 10% off or turn unwanted gift cards into cash. VoucherTrade is South
              Africa's easiest way to buy and sell digital vouchers.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/vouchers"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Buy a Voucher
              </Link>
              <Link
                href="/register"
                className="bg-accent text-red-500 px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition"
              >
                Sell a Voucher
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How VoucherTrade Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold text-lg mb-2">Sellers Get 70%</h3>
                <p className="text-muted-foreground">
                  Sell your unwanted vouchers and receive 70% of the face value directly to your account.
                </p>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="font-bold text-lg mb-2">Buyers Save 10%</h3>
                <p className="text-muted-foreground">
                  Purchase vouchers at 10% discount. Shop your favorite retailers while saving money.
                </p>
              </div>

              <div className="card text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="font-bold text-lg mb-2">100% Safe & Verified</h3>
                <p className="text-muted-foreground">
                  Every voucher is verified. All transactions are secure with buyer protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Brands */}
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Popular Brands</h2>
            <p className="text-center text-muted-foreground mb-12">Find vouchers from your favorite retailers</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Array.from(new Set(vouchersData.map((v) => v.brand))).map((brandName) => {
                const brandData = vouchersData.find((v) => v.brand === brandName)
                return (
                  <div
                    key={brandName}
                    className="bg-background p-6 rounded-lg text-center border border-border hover:border-primary transition flex items-center justify-center h-28"
                  >
                    <Image
                      src={brandData?.logo || "/placeholder.svg"}
                      alt={brandName}
                      width={100}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
            <p className="text-xl mb-8 text-white/90">Join thousands of South Africans saving money on vouchers.</p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Get Started Now
              </Link>
              <Link
                href="/vouchers"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition"
              >
                Browse Vouchers
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
