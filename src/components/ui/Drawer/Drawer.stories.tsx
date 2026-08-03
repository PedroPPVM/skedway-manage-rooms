import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Checkbox } from '../Checkbox/Checkbox'
import { Drawer } from './Drawer'

const meta = {
  title: 'Design System/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: false,
    title: 'Filtros',
    onClose: () => {},
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Abrir drawer
        </Button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3">
            <Checkbox label="Apenas salas disponíveis" />
            <Checkbox label="Com videoconferência" />
            <Button onClick={() => setOpen(false)}>Aplicar</Button>
          </div>
        </Drawer>
      </>
    )
  },
}
