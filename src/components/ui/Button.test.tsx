import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('fires onClick when enabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Salvar
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('disables the button and marks it busy while loading', () => {
    render(<Button isLoading>Salvando</Button>)

    const button = screen.getByRole('button', { name: 'Salvando' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})
