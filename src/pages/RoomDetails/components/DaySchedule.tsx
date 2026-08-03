import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Input, Skeleton } from '../../../components/ui'
import { useReservations } from '../../../hooks'
import {
  buildDaySchedule,
  formatTime,
  parseDateKey,
  toDateKey,
} from '../../../utils'

interface DayScheduleProps {
  roomId: string
}

export function DaySchedule({ roomId }: DayScheduleProps) {
  const { t, i18n } = useTranslation()
  const [dateKey, setDateKey] = useState(() => toDateKey(new Date()))

  const { data: reservations, isPending } = useReservations({
    roomId,
    date: dateKey,
  })

  const schedule = useMemo(
    () =>
      reservations
        ? buildDaySchedule(parseDateKey(dateKey), reservations)
        : undefined,
    [reservations, dateKey],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          {t('roomDetails.schedule')}
        </h3>
        <Input
          type="date"
          label={t('roomDetails.date')}
          value={dateKey}
          onChange={(event) => {
            if (event.target.value) setDateKey(event.target.value)
          }}
          className="w-40"
        />
      </div>

      {isPending && (
        <div role="status" className="flex flex-col gap-2">
          <span className="sr-only">{t('common.loading')}</span>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      )}

      {schedule && (
        <ul className="max-h-72 divide-y divide-border overflow-y-auto rounded-md border border-border">
          {schedule.map((slot) => (
            <li
              key={slot.startAt}
              className="flex min-h-11 items-center gap-3 px-3 py-1.5"
            >
              <span className="w-16 text-sm font-medium text-foreground tabular-nums">
                {formatTime(new Date(slot.startAt), i18n.language)}
              </span>
              <Badge variant={slot.status === 'free' ? 'success' : 'danger'}>
                {t(`roomDetails.slot.${slot.status}`)}
              </Badge>
              {slot.reservation && (
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {slot.reservation.responsible}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
