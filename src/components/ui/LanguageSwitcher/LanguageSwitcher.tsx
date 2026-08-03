import { BR, ES, US } from 'country-flag-icons/react/3x2'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../../i18n'
import type { SupportedLanguage } from '../../../i18n'

const flags = {
  'pt-BR': BR,
  en: US,
  es: ES,
} satisfies Record<SupportedLanguage, typeof BR>

function isSupportedLanguage(value?: string): value is SupportedLanguage {
  return (
    value !== undefined &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  )
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = isSupportedLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : 'pt-BR'
  const Flag = flags[current]

  return (
    <div className="relative">
      <Flag
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-5 -translate-y-1/2 rounded-xs"
      />
      <select
        aria-label={t('language.label')}
        value={current}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        className="h-10 appearance-none rounded-md border border-border bg-surface-elevated pr-9 pl-10 text-sm text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-sm:w-19 max-sm:text-transparent"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
