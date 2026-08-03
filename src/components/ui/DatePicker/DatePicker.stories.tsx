import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Design System/DatePicker',
  component: DatePicker,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Data',
    value: '2026-08-03',
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <DatePicker {...args} value={value} onChange={setValue} />
  },
}
