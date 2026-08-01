import { Inbox } from 'lucide-react'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { AppLayout } from '../../components/layout'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Select,
  Skeleton,
  Spinner,
} from '../../components/ui'
import { useToast } from '../../contexts/toast'

// Temporary showcase (PRD 002) — replaced by the rooms list in feat/rooms-list
function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toast = useToast()

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <Section title="Botões">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Desabilitado</Button>
          <Button isLoading>Carregando</Button>
        </Section>

        <Section title="Badges">
          <Badge variant="success">Disponível</Badge>
          <Badge variant="danger">Ocupada</Badge>
          <Badge variant="warning">Aviso</Badge>
          <Badge variant="neutral">TV</Badge>
          <Badge variant="accent">Videoconferência</Badge>
        </Section>

        <Section title="Formulário">
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <Input label="Nome do responsável" placeholder="Ex.: Ana Souza" />
            <Input
              label="Com erro"
              defaultValue="valor inválido"
              error="Mensagem de erro do campo."
            />
            <Select label="Capacidade mínima" defaultValue="4">
              <option value="2">2 pessoas</option>
              <option value="4">4 pessoas</option>
              <option value="8">8 pessoas</option>
            </Select>
            <Input label="Desabilitado" disabled placeholder="Sem edição" />
          </div>
        </Section>

        <Section title="Modal e Toasts">
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Abrir modal
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.success('Reserva criada com sucesso.')}
          >
            Toast de sucesso
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error('Esta sala já possui uma reserva neste horário.')
            }
          >
            Toast de erro
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.info('As reservas seguem o horário comercial.')
            }
          >
            Toast de info
          </Button>
        </Section>

        <Section title="Loading">
          <Spinner size="sm" />
          <Spinner />
          <Card className="w-64">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/3" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </Card>
        </Section>

        <Section title="Estados">
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <EmptyState
              icon={Inbox}
              title="Nenhuma sala encontrada"
              description="Ajuste os filtros ou limpe a pesquisa para ver resultados."
              action={<Button variant="secondary">Limpar filtros</Button>}
            />
            <ErrorState
              title="Erro ao carregar as salas"
              description="Não foi possível buscar os dados. Tente novamente."
              onRetry={() => toast.info('Tentando novamente...')}
            />
          </div>
        </Section>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova reserva"
      >
        <div className="flex flex-col gap-4">
          <Input label="Nome do responsável" placeholder="Ex.: Ana Souza" />
          <p className="text-sm text-muted-foreground">
            Conteúdo de exemplo — feche por Esc, clique fora ou no X.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                toast.success('Ação confirmada no modal.')
              }}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  )
}

export default Home
