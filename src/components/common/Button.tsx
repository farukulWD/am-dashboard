import React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={cn("px-4 py-2 flex items-center gap-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition", className)}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button } 