import React from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => (
  <label
    className={`block text-sm font-medium text-muted-foreground mb-1 ${className}`}
    {...props}
  >
    {children}
  </label>
)

export default Label 