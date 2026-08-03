import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ToggleChip } from './ToggleChip'

const meta = {
  title: 'Design System/ToggleChip',
  component: ToggleChip,
  args: { children: 'Apenas salas disponíveis', pressed: false },
} satisfies Meta<typeof ToggleChip>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(false)
    return (
      <ToggleChip
        {...args}
        pressed={pressed}
        onClick={() => setPressed(!pressed)}
      />
    )
  },
}

export const Pressed: Story = { args: { pressed: true } }
