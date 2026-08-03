import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorState } from './ErrorState'

const meta = {
  title: 'Design System/ErrorState',
  component: ErrorState,
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Erro ao carregar as salas',
    description: 'Não foi possível buscar os dados. Tente novamente.',
  },
}

export const WithRetry: Story = {
  args: {
    title: 'Erro ao carregar as salas',
    description: 'Não foi possível buscar os dados. Tente novamente.',
    onRetry: () => {},
  },
}
