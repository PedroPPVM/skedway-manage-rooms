import { X } from 'lucide-react'
import { useId } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../utils'
import { Button } from './Button'
import { useNativeDialog } from './use-native-dialog'

interface DrawerProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title: string
  className?: string
}

export function Drawer({
  open,
  onClose,
  title,
  className,
  children,
}: DrawerProps) {
  const { t } = useTranslation()
  const { dialogRef, handleCancel, handleBackdropClick } = useNativeDialog(
    open,
    onClose,
  )
  const titleId = useId()

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={cn(
        'm-auto mb-0 max-h-[85dvh] w-full max-w-none animate-slide-up rounded-t-lg border-t border-border bg-surface-elevated p-0 text-foreground shadow-lg backdrop:bg-black/50',
        className,
      )}
    >
      {open && (
        <>
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label={t('common.close')}
              className="px-2"
            >
              <X size={18} aria-hidden="true" />
            </Button>
          </div>
          <div className="overflow-y-auto p-4">{children}</div>
        </>
      )}
    </dialog>
  )
}
