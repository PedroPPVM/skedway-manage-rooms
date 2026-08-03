import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MultiSelect } from './MultiSelect'

const options = [
  { value: 'tv', label: 'TV' },
  { value: 'video_conference', label: 'Videoconferência' },
  { value: 'whiteboard', label: 'Quadro branco' },
  { value: 'projector', label: 'Projetor' },
  { value: 'air_conditioning', label: 'Ar-condicionado' },
]

const meta = {
  title: 'Design System/MultiSelect',
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Recursos',
    placeholder: 'Selecionar recursos',
    options,
    value: [],
    onChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['tv'])
    return (
      <div className="w-72">
        <MultiSelect
          {...args}
          value={value}
          onChange={(next) => setValue(next)}
        />
      </div>
    )
  },
}
