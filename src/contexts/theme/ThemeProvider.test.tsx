import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMatchMedia } from '../../../vitest.setup'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

function Demo() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>escurecer</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <Demo />
    </ThemeProvider>,
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to the system theme', () => {
    renderWithProvider()

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('resolves to dark when the system prefers dark', () => {
    window.matchMedia = createMatchMedia(true)
    renderWithProvider()

    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('persists a manual choice and applies the dark class', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByRole('button', { name: 'escurecer' }))

    expect(localStorage.getItem('skedway:theme')).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('restores the stored theme on mount', () => {
    localStorage.setItem('skedway:theme', 'dark')
    renderWithProvider()

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('throws when useTheme is used outside the provider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    )
  })
})
