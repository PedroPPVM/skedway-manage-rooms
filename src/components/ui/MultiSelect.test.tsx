import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MultiSelect } from './MultiSelect'

const options = [
  { value: 'tv', label: 'TV' },
  { value: 'projector', label: 'Projetor' },
  { value: 'whiteboard', label: 'Quadro branco' },
]

function Demo() {
  const [value, setValue] = useState<string[]>([])

  return (
    <MultiSelect
      label="Recursos"
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Selecionar recursos"
    />
  )
}

describe('MultiSelect', () => {
  it('selects multiple options keeping the listbox open', async () => {
    const user = userEvent.setup()
    render(<Demo />)

    const trigger = screen.getByRole('button', {
      name: /Recursos/,
    })
    expect(trigger).toHaveTextContent('Selecionar recursos')

    await user.click(trigger)
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'TV' }))
    await user.click(screen.getByRole('option', { name: 'Projetor' }))

    expect(screen.getByRole('option', { name: 'TV' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(trigger).toHaveTextContent('TV, Projetor')
  })
})
