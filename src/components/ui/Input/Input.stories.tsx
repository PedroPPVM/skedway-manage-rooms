import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta = {
  title: 'Design System/Input',
  component: Input,
  args: { label: 'Nome do responsável', placeholder: 'Ex.: Ana Souza' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  args: {
    defaultValue: 'a',
    error: 'Informe o responsável (mínimo 2 caracteres).',
  },
}

export const Disabled: Story = { args: { disabled: true } }
