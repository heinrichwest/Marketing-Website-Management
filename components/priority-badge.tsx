import type { TicketPriority } from "@/types"
import { getPriorityDisplayName, getPriorityColor } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: TicketPriority
  className?: string
}

export default function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  const icon = {
    low: "↓",
    medium: "→",
    high: "↑",
    critical: "‼",
  }[priority]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
        priority,
      )} ${className}`}
    >
      <span>{icon}</span>
      {getPriorityDisplayName(priority)}
    </span>
  )
}
