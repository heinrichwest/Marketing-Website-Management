import { formatNumber } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export default function StatCard({ title, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl lg:text-4xl font-bold text-foreground leading-none">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {trend && (
            <div className="flex items-center gap-2 mt-3">
               <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                 trend.isPositive
                   ? "bg-success/10 text-success-foreground"
                   : "bg-destructive/10 text-destructive-foreground"
               }`}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="text-primary w-6 h-6">{icon}</div>
          </div>
        )}
      </div>
    </div>
  )
}
