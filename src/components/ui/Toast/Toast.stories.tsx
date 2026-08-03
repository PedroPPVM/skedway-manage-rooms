import type { Meta, StoryObj } from '@storybook/react-vite'
import { useToast } from '../../../contexts/toast'
import { Button } from '../Button/Button'
import { ToastViewport } from './Toast'

function ToastDemo() {
  const toast = useToast()

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() => toast.success('Reserva criada com sucesso.')}
      >
        Sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error('Esta sala já possui uma reserva neste horário.')
        }
      >
        Erro
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.info('As reservas seguem o horário comercial.')}
      >
        Info
      </Button>
    </div>
  )
}

const meta = {
  title: 'Design System/Toast',
  component: ToastViewport,
} satisfies Meta<typeof ToastViewport>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { toasts: [], onDismiss: () => {} },
  render: () => <ToastDemo />,
}
