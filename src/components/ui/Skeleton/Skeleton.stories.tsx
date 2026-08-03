import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card/Card'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Design System/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {
  args: { className: 'h-4 w-48' },
}

export const CardComposition: Story = {
  render: () => (
    <Card className="w-64">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/3" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </Card>
  ),
}
