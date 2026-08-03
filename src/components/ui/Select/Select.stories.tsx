import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta = {
  title: 'Design System/Select',
  component: Select,
  args: { label: 'Duração' },
  render: (args) => (
    <Select {...args} defaultValue="60" className="w-56">
      <option value="30">30 min</option>
      <option value="60">1 h</option>
      <option value="90">1 h 30 min</option>
      <option value="120">2 h</option>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'Selecione a duração.' },
}

export const Disabled: Story = { args: { disabled: true } }
