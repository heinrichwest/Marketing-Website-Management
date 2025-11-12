export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-foreground mb-4">VoucherTrade</h4>
            <p className="text-muted-foreground text-sm">
              Safely buy and sell digital vouchers at the best prices in South Africa.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Browse</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  All Vouchers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Trending
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Sell</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  How to Sell
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Seller FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Support</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">© 2025 VoucherTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
