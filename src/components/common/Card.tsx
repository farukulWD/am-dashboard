import React from "react"
import { cn } from "@/lib/utils"

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
    <div className={cn("bg-background  rounded-lg shadow border border-border/50", className)}>{children}</div>
)

const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
    <div className={cn("p-4 border-b border-border/50", className)}>{children}</div>
)

const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
    <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
)

const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
    <p className={cn("text-sm text-gray-500", className)}>{children}</p>
)

const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
    <div className={cn("p-4", className)}>{children}</div>
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent } 