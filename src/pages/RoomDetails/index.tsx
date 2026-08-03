import { MapPin, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Badge, ErrorState, Modal, Skeleton } from '../../components/ui'
import { useRoom } from '../../hooks'
import { ApiError } from '../../services/http'
import { getApiErrorKey } from '../../i18n/api-errors'
import { DaySchedule } from './components/DaySchedule'

function RoomDetails() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: room, isPending, isError, error, refetch } = useRoom(id)

  const close = () => {
    navigate({ pathname: '/', search: location.search })
  }

  const notFound = error instanceof ApiError && error.status === 404

  return (
    <Modal
      open
      onClose={close}
      title={room?.name ?? t('roomDetails.title')}
      className="max-w-xl"
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
        <div className="flex flex-col gap-4">
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

          <DaySchedule roomId={room.id} />
        </div>
      )}
    </Modal>
  )
}

export default RoomDetails
