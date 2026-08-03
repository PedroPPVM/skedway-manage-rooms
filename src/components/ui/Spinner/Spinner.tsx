import { Loader2 } from 'lucide-react'
import { cn } from '../../../utils'

const sizes = {
  sm: 16,
  md: 24,
} as const

interface SpinnerProps {
  size?: keyof typeof sizes
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      aria-hidden="true"
      size={sizes[size]}
      className={cn('animate-spin', className)}
    />
  )
}
