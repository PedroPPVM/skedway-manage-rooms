import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Modal } from './Modal'

const meta = {
  title: 'Design System/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: false,
    title: 'Cancelar reserva?',
    onClose: () => {},
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir modal</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              A reserva de 10:00 – 11:00 na Sala Orion será cancelada.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Manter reserva
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Cancelar reserva
              </Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}
