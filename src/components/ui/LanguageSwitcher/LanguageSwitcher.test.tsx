import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from '../../../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('shows the three languages with the current one selected', () => {
    render(<LanguageSwitcher />)

    const select = screen.getByLabelText('Idioma')
    expect(select).toHaveValue('pt-BR')
    expect(
      screen.getByRole('option', { name: 'Português (Brasil)' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Español' })).toBeInTheDocument()
  })

  it('changes the app language and translates its own label', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.selectOptions(screen.getByLabelText('Idioma'), 'en')

    expect(i18n.resolvedLanguage).toBe('en')
    expect(screen.getByLabelText('Language')).toHaveValue('en')
  })

  it('persists the chosen language in localStorage', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.selectOptions(screen.getByLabelText('Idioma'), 'es')

    expect(localStorage.getItem('skedway:locale')).toBe('es')
  })

  it('updates the document lang attribute', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.selectOptions(screen.getByLabelText('Idioma'), 'en')

    expect(document.documentElement.lang).toBe('en')
  })
})
