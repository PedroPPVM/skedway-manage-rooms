import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import i18n from '../../i18n'
import { DatePicker } from './DatePicker'

function Demo() {
  const [value, setValue] = useState('2026-08-03')
  return <DatePicker label="Data" value={value} onChange={setValue} />
}

describe('DatePicker', () => {
  it('shows the date in the input and picks a day from the calendar popup', async () => {
    const user = userEvent.setup()
    render(<Demo />)

    const input = screen.getByLabelText('Data')
    expect(input).toHaveValue('03/08/2026')

    await user.click(screen.getByRole('button', { name: 'Abrir calendário' }))
    expect(screen.getByRole('grid')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /\b5 de agosto/ }))

    expect(input).toHaveValue('05/08/2026')
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })

  it('masks typed digits and reverts invalid input on blur', async () => {
    const user = userEvent.setup()
    render(<Demo />)

    const input = screen.getByLabelText('Data')
    await user.clear(input)
    await user.type(input, '1508')
    expect(input).toHaveValue('15/08')

    await user.type(input, '2026')
    await user.tab()
    expect(input).toHaveValue('15/08/2026')

    await user.clear(input)
    await user.type(input, '99992026')
    await user.tab()
    expect(input).toHaveValue('15/08/2026')
  })

  it('formats the input, placeholder and calendar by the active language', async () => {
    const user = userEvent.setup()
    render(<Demo />)

    await act(async () => {
      await i18n.changeLanguage('en')
    })

    const input = screen.getByLabelText('Data')
    expect(input).toHaveValue('08/03/2026')
    expect(input).toHaveAttribute('placeholder', 'mm/dd/yyyy')

    await user.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(screen.getByText('August 2026')).toBeInTheDocument()
  })
})
