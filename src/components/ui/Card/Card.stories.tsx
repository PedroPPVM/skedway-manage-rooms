import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../Badge/Badge'
import { Card } from './Card'

const meta = {
  title: 'Design System/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-xs">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">Sala Orion</h3>
        <Badge variant="success">Disponível</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        12 pessoas · 3º Andar
      </p>
    </Card>
  ),
}
