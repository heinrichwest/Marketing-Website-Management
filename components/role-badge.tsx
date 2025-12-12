import type { UserRole } from "@/types"
import { getRoleDisplayName, getRoleColor } from "@/lib/utils"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(
        role,
      )} ${className}`}
    >
      {getRoleDisplayName(role)}
    </span>
  )
}
