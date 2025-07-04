import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={cn("w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-blue-200 text-sm", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";
export default Input; 