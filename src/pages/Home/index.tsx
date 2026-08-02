import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState, ErrorState } from '../../components/ui'
import { useRooms } from '../../hooks'
import { RoomCard } from './components/RoomCard'
import { RoomCardSkeleton } from './components/RoomCardSkeleton'

const SKELETON_COUNT = 6

function Home() {
  const { t } = useTranslation()
  const { data: rooms, isPending, isError, refetch } = useRooms()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          {t('rooms.title')}
        </h1>
        {rooms && (
          <span className="text-sm text-muted-foreground">
            {t('rooms.count', { count: rooms.length })}
          </span>
        )}
      </div>

      {isPending && (
        <div role="status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">{t('rooms.loading')}</span>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title={t('rooms.error.title')}
          description={t('rooms.error.description')}
          onRetry={() => refetch()}
        />
      )}

      {rooms &&
        (rooms.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t('rooms.empty.title')}
            description={t('rooms.empty.description')}
          />
        ) : (
          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <li key={room.id}>
                <RoomCard room={room} />
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}

export default Home
