interface PriceBreakdownProps {
  faceValue: number
  label?: string
}

export function PriceBreakdown({ faceValue, label = "Pricing Breakdown" }: PriceBreakdownProps) {
  const buyerPrice = Math.round(faceValue * 0.9)
  const sellerPayout = Math.round(faceValue * 0.7)
  const savings = faceValue - buyerPrice

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-foreground">{label}</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Face Value</span>
          <span className="text-foreground">R{faceValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Buyer Pays (90%)</span>
          <span className="text-foreground">R{buyerPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Seller Gets (70%)</span>
          <span className="text-success font-semibold">R{sellerPayout}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Buyer Saves (10%)</span>
          <span className="text-success">R{savings}</span>
        </div>
      </div>
    </div>
  )
}
