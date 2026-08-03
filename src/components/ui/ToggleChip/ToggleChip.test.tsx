import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ToggleChip } from './ToggleChip'

function Demo() {
  const [pressed, setPressed] = useState(false)

  return (
    <ToggleChip pressed={pressed} onClick={() => setPressed(!pressed)}>
      Apenas salas disponíveis
    </ToggleChip>
  )
}

describe('ToggleChip', () => {
  it('toggles the pressed state accessibly', async () => {
    const user = userEvent.setup()
    render(<Demo />)

    const chip = screen.getByRole('button', {
      name: 'Apenas salas disponíveis',
    })
    expect(chip).toHaveAttribute('aria-pressed', 'false')

    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')

    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'false')
  })
})
