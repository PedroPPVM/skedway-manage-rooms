import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import { ToastProvider } from '../src/contexts/toast'
import i18n from '../src/i18n'
import '../src/styles/index.css'

// Storybook instruments HTMLElement.focus with a getter installed during
// the runtime boot; Headless UI's global focus setup cannot wrap getters
// (Illegal invocation on prototype reads). The descriptor is normalized
// back to a plain function at every stage that precedes a story import.
function normalizeFocusDescriptor() {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'focus',
  )
  if (!descriptor?.get) return

  const focusFn = document.createElement('button').focus
  if (typeof focusFn === 'function') {
    Object.defineProperty(HTMLElement.prototype, 'focus', {
      value: focusFn,
      writable: true,
      configurable: true,
    })
  }
}

normalizeFocusDescriptor()

interface ProjectEnvironmentProps {
  theme: string
  locale: string
  children: React.ReactNode
}

function ProjectEnvironment({
  theme,
  locale,
  children,
}: ProjectEnvironmentProps) {
  normalizeFocusDescriptor()

  // synchronous change + keyed remount: stories re-mount already in the
  // new language instead of relying on the i18next subscription
  if (i18n.resolvedLanguage !== locale) {
    void i18n.changeLanguage(locale)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ToastProvider>
      <div key={locale} className="bg-surface p-6 text-foreground">
        {children}
      </div>
    </ToastProvider>
  )
}

const withProjectEnvironment: Decorator = (Story, context) => (
  <ProjectEnvironment
    theme={context.globals.theme}
    locale={context.globals.locale}
  >
    <Story />
  </ProjectEnvironment>
)

const preview: Preview = {
  beforeAll: () => {
    normalizeFocusDescriptor()
  },
  decorators: [withProjectEnvironment],
  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Idioma',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'pt-BR', title: 'Português (Brasil)' },
          { value: 'en', title: 'English' },
          { value: 'es', title: 'Español' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    locale: 'pt-BR',
  },
  parameters: {
    a11y: { test: 'todo' },
  },
}

export default preview
