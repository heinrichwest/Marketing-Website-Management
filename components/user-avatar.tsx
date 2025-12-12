import { getUserInitials } from "@/lib/utils"

interface UserAvatarProps {
  fullName: string
  profileImage?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function UserAvatar({ fullName, profileImage, size = "md", className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary text-white flex items-center justify-center font-semibold ${className}`}
      title={fullName}
    >
      {profileImage ? (
        <img src={profileImage} alt={fullName} className="w-full h-full rounded-full object-cover" />
      ) : (
        getUserInitials(fullName)
      )}
    </div>
  )
}
