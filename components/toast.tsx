"use client"

import { useState } from "react"

type ToastType = "success" | "error" | "info"

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: ToastType = "info") => {
    const id = String(toastId++)
    const newToast: ToastMessage = { id, message, type }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { toasts, showToast }
}

interface ToastContainerProps {
  toasts: ToastMessage[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 text-white text-sm font-medium shadow-lg transition-all ${
            toast.type === "success" ? "bg-success" : toast.type === "error" ? "bg-danger" : "bg-primary"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
