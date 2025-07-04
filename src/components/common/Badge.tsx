import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, className = "", ...props }) => {
  return (
    <span
      className={cn("inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-800", className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge } 