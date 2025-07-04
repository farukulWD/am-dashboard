import React, { useState, createContext, useContext, ReactNode } from "react"

interface TabsProps {
  defaultValue: string
  className?: string
  children: ReactNode
}

interface TabsContextType {
  value: string
  setValue: (val: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function Tabs({ defaultValue, className = "", children }: TabsProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex gap-2 mb-2 ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className = "" }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs")
  const isActive = ctx.value === value
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} ${className}`}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className = "" }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("TabsContent must be used within Tabs")
  if (ctx.value !== value) return null
  return <div className={className}>{children}</div>
}

export default Tabs 