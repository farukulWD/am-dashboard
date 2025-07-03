import React, { forwardRef, SelectHTMLAttributes, ReactNode } from "react";

interface OptionType {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: OptionType[];
  children?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", options, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full border border-border rounded-md px-3 py-2 bg-background text-muted-foreground text-sm focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-blue-200 ${className}`}
      {...props}
    >
      {options
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  )
);
Select.displayName = "Select";
export default Select; 