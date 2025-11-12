interface Stat {
  label: string
  value: string | number
  subtext?: string
  color?: "primary" | "success" | "warning" | "danger"
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const colClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns]

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6`}>
      {stats.map((stat, idx) => (
        <div key={idx} className="card">
          <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
          <p
            className={`text-3xl font-bold ${
              stat.color === "success"
                ? "text-success"
                : stat.color === "primary"
                  ? "text-primary"
                  : stat.color === "danger"
                    ? "text-danger"
                    : stat.color === "warning"
                      ? "text-warning"
                      : "text-foreground"
            }`}
          >
            {stat.value}
          </p>
          {stat.subtext && <p className="text-xs text-muted-foreground mt-2">{stat.subtext}</p>}
        </div>
      ))}
    </div>
  )
}
