import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

function renderSelect(error?: string) {
  return render(
    <Select label="Capacidade" defaultValue="2" error={error}>
      <option value="2">2 pessoas</option>
      <option value="4">4 pessoas</option>
    </Select>,
  )
}

describe('Select', () => {
  it('associates the label and changes value', async () => {
    const user = userEvent.setup()
    renderSelect()

    const select = screen.getByLabelText('Capacidade')
    await user.selectOptions(select, '4')

    expect(select).toHaveValue('4')
  })

  it('exposes the error message accessibly', () => {
    renderSelect('Selecione uma opção.')

    const select = screen.getByLabelText('Capacidade')
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveAccessibleDescription('Selecione uma opção.')
  })
})
