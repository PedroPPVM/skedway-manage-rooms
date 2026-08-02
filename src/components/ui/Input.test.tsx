import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('associates the label with the field', () => {
    render(<Input label="Nome do responsável" />)

    expect(screen.getByLabelText('Nome do responsável')).toBeInTheDocument()
  })

  it('is valid and without description when there is no error', () => {
    render(<Input label="Nome" />)

    const input = screen.getByLabelText('Nome')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('exposes the error message accessibly', () => {
    render(<Input label="Nome" error="Campo obrigatório." />)

    const input = screen.getByLabelText('Nome')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Campo obrigatório.')
  })
})
