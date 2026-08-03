import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '../../../utils'

const VISIBILITY_THRESHOLD_PX = 300

interface ScrollToTopButtonProps {
  targetRef: RefObject<HTMLElement | null>
  className?: string
}

// Overlays the scrollable target: render it as a sibling inside a
// position-relative wrapper
export function ScrollToTopButton({
  targetRef,
  className,
}: ScrollToTopButtonProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const handleScroll = () => {
      setVisible(target.scrollTop > VISIBILITY_THRESHOLD_PX)
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    return () => target.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  if (!visible) return null

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    targetRef.current?.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('common.backToTop')}
      className={cn(
        'absolute right-4 bottom-4 rounded-full border border-border bg-surface-elevated p-2.5 text-foreground shadow-lg transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
