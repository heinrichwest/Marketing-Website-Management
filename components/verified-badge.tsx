interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function VerifiedBadge({ size = "md", showText = true }: VerifiedBadgeProps) {
  const sizeClass = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }[size]

  return (
    <div className={`badge badge-success ${sizeClass}`}>
      <span className="mr-1">✓</span>
      {showText && "Verified"}
    </div>
  )
}
