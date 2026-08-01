import { createContext } from 'react'

export const TOAST_VARIANTS = ['success', 'error', 'info'] as const

export type ToastVariant = (typeof TOAST_VARIANTS)[number]

export interface Toast {
  id: string
  variant: ToastVariant
  message: string
}

export interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
