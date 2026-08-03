import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Design System/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { variant: 'success', children: 'Disponível' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Ocupada' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Aviso' },
}

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'TV' },
}

export const Accent: Story = {
  args: { variant: 'accent', children: 'Videoconferência' },
}
