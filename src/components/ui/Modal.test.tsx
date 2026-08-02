import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

function renderModal(open = true, onClose = vi.fn()) {
  const view = render(
    <Modal open={open} onClose={onClose} title="Nova reserva">
      <p>Conteúdo do modal</p>
    </Modal>,
  )
  return { ...view, onClose }
}

function getDialog(): HTMLDialogElement {
  const dialog = document.querySelector('dialog')
  if (!dialog) throw new Error('dialog not found')
  return dialog
}

describe('Modal', () => {
  it('opens with the title as accessible name', () => {
    renderModal()

    const dialog = getDialog()
    expect(dialog).toHaveAttribute('open')
    expect(dialog).toHaveAccessibleName('Nova reserva')
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument()
  })

  it('stays closed when open is false', () => {
    renderModal(false)

    expect(getDialog()).not.toHaveAttribute('open')
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const { onClose } = renderModal()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the cancel event fires (Esc)', () => {
    const { onClose } = renderModal()

    fireEvent(getDialog(), new Event('cancel'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', () => {
    const { onClose } = renderModal()

    fireEvent.click(getDialog())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the content is clicked', () => {
    const { onClose } = renderModal()

    fireEvent.click(screen.getByText('Conteúdo do modal'))

    expect(onClose).not.toHaveBeenCalled()
  })
})
