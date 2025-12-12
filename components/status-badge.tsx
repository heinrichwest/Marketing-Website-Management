import type { TicketStatus, ProjectStatus } from "@/types"
import { getStatusDisplayName, getStatusColor } from "@/lib/utils"

interface StatusBadgeProps {
  status: TicketStatus | ProjectStatus
  className?: string
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        status,
      )} ${className}`}
    >
      {getStatusDisplayName(status)}
    </span>
  )
}
