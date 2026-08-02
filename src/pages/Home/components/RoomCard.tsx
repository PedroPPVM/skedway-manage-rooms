import { MapPin, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge, Card } from '../../../components/ui'
import type { Room } from '../../../types'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const { t } = useTranslation()
  const available = room.status === 'available'

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">{room.name}</h3>
        <Badge variant={available ? 'success' : 'danger'}>
          {t(`rooms.status.${room.status}`)}
        </Badge>
      </div>
      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
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
        <div className="mt-auto flex flex-wrap gap-1.5">
          {room.resources.map((resource) => (
            <Badge key={resource} variant="neutral">
              {t(`rooms.resources.${resource}`)}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}
