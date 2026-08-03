import { CalendarPlus, MapPin, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, ErrorState, Modal, Skeleton } from '../../components/ui'
import { useRoom } from '../../hooks'
import { ApiError } from '../../services/http'
import { getApiErrorKey } from '../../i18n/api-errors'
import { toDateKey } from '../../utils'
import { DaySchedule } from './components/DaySchedule'
import { ReservationForm } from './components/ReservationForm'

function RoomDetails() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [dateKey, setDateKey] = useState(() => toDateKey(new Date()))
  const [view, setView] = useState<'schedule' | 'form'>('schedule')
  const [formStartAt, setFormStartAt] = useState<string | null>(null)
  const openFormButtonRef = useRef<HTMLButtonElement>(null)
  const previousView = useRef(view)

  const { data: room, isPending, isError, error, refetch } = useRoom(id)

  useEffect(() => {
    if (view === 'schedule' && previousView.current === 'form') {
      openFormButtonRef.current?.focus()
    }
    previousView.current = view
  }, [view])

  const openForm = (startAt: string | null) => {
    setFormStartAt(startAt)
    setView('form')
  }

  const close = () => {
    navigate({ pathname: '/', search: location.search })
  }

  const notFound = error instanceof ApiError && error.status === 404

  return (
    <Modal
      open
      onClose={close}
      title={room?.name ?? t('roomDetails.title')}
      className="max-w-xl max-sm:h-dvh max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:rounded-none max-sm:border-none sm:h-[min(85dvh,44rem)]"
    >
      {isPending && (
        <div role="status" className="flex flex-col gap-3">
          <span className="sr-only">{t('common.loading')}</span>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      )}

      {isError && (
        <ErrorState
          title={
            notFound ? t(getApiErrorKey(error.code)) : t('rooms.error.title')
          }
          description={notFound ? undefined : t('rooms.error.description')}
          onRetry={notFound ? undefined : () => refetch()}
        />
      )}

      {room && (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Badge variant={room.status === 'available' ? 'success' : 'danger'}>
              {t(`rooms.status.${room.status}`)}
            </Badge>
            <span className="flex items-center gap-1.5">
              <Users size={16} aria-hidden="true" />
              {t('rooms.capacity', { count: room.capacity })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} aria-hidden="true" />
              {room.location}
            </span>
          </div>

          {room.resources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.resources.map((resource) => (
                <Badge key={resource} variant="neutral">
                  {t(`rooms.resources.${resource}`)}
                </Badge>
              ))}
            </div>
          )}

          {view === 'schedule' ? (
            <>
              <DaySchedule
                roomId={room.id}
                roomName={room.name}
                dateKey={dateKey}
                onDateKeyChange={setDateKey}
                onReserveSlot={openForm}
              />
              <Button
                ref={openFormButtonRef}
                onClick={() => openForm(null)}
                className="w-full"
              >
                <CalendarPlus size={16} aria-hidden="true" />
                {t('newReservation.open')}
              </Button>
            </>
          ) : (
            <ReservationForm
              roomId={room.id}
              initialDateKey={dateKey}
              initialStartAt={formStartAt}
              onBack={() => setView('schedule')}
            />
          )}
        </div>
      )}
    </Modal>
  )
}

export default RoomDetails
