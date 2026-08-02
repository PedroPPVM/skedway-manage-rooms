import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Toast, ToastVariant } from '../../contexts/toast/toast-context'
import { cn } from '../../utils'

const variantIcons = {
  success: { icon: CheckCircle2, className: 'text-success' },
  error: { icon: XCircle, className: 'text-danger' },
  info: { icon: Info, className: 'text-primary' },
} satisfies Record<ToastVariant, { icon: typeof Info; className: string }>

interface ToastViewportProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto"
    >
      {toasts.map((toast) => {
        const { icon: Icon, className } = variantIcons[toast.variant]

        return (
          <div
            key={toast.id}
            className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-surface-elevated p-3 shadow-lg"
          >
            <Icon
              aria-hidden="true"
              size={20}
              className={cn('shrink-0', className)}
            />
            <p className="flex-1 text-sm text-foreground">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label={t('common.closeNotification')}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
