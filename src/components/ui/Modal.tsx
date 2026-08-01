import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, PropsWithChildren, SyntheticEvent } from 'react'
import { cn } from '../../utils'
import { Button } from './Button'

interface ModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title: string
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  className,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // preventDefault keeps the open state owned by React instead of the browser
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onClose()
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
      className={cn(
        'm-auto w-full max-w-md rounded-lg border border-border bg-surface-elevated p-0 text-foreground shadow-lg backdrop:bg-black/50',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Fechar"
          className="px-2"
        >
          <X size={18} aria-hidden="true" />
        </Button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  )
}
