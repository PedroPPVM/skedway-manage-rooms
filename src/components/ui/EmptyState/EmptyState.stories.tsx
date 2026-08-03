import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox, SearchX } from 'lucide-react'
import { Button } from '../Button/Button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Design System/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: Inbox,
    title: 'Nenhuma sala encontrada',
    description: 'Não há salas cadastradas no momento.',
  },
}

export const WithAction: Story = {
  args: {
    icon: SearchX,
    title: 'Nenhuma sala corresponde aos filtros',
    description: 'Ajuste a pesquisa ou limpe os filtros para ver mais salas.',
    action: <Button variant="secondary">Limpar filtros</Button>,
  },
}
