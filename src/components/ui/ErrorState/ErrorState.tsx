import { AlertTriangle, RotateCcw } from 'lucide-react'
import { cn } from '../../../utils'
import { Button } from '../Button/Button'

interface ErrorStateProps {
  title: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-danger/40 px-6 py-12 text-center',
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" size={32} className="text-danger" />
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
