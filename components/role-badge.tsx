import type { UserRole } from "@/types"
import { getRoleDisplayName, getRoleColor } from "@/lib/utils"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const isAdmin = role === "admin"

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 shadow-sm ${
        isAdmin
          ? "bg-gradient-to-r from-primary to-primary-dark text-white border-primary/80 shadow-primary/20"
          : getRoleColor(role)
      } ${className}`}
    >
      {isAdmin && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )}
      {getRoleDisplayName(role)}
      {isAdmin && (
        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )}
    </span>
  )
}
