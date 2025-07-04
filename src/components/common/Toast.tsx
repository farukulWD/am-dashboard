import React, { useEffect } from "react"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-6 right-6 z-[100] px-4 py-2 rounded shadow-lg text-white text-sm font-medium transition-all
      ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  )
}

export default Toast 