import { CalendarPlus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  DatePicker,
  Modal,
  Skeleton,
} from '../../../components/ui'
import { useToast } from '../../../contexts/toast'
import { useUser } from '../../../contexts/user'
import { useCancelReservation, useReservations } from '../../../hooks'
import { getApiErrorKey } from '../../../i18n/api-errors'
import { ApiError } from '../../../services/http'
import type { Reservation } from '../../../types'
import {
  buildDaySchedule,
  formatTime,
  isReservationOwner,
  parseDateKey,
} from '../../../utils'

interface DayScheduleProps {
  roomId: string
  roomName: string
  dateKey: string
  onDateKeyChange: (dateKey: string) => void
  onReserveSlot: (startAt: string) => void
}

export function DaySchedule({
  roomId,
  roomName,
  dateKey,
  onDateKeyChange,
  onReserveSlot,
}: DayScheduleProps) {
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const toast = useToast()
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null)

  const { data: reservations, isPending } = useReservations({
    roomId,
    date: dateKey,
  })
  const cancelReservation = useCancelReservation()

  const schedule = useMemo(
    () =>
      reservations
        ? buildDaySchedule(parseDateKey(dateKey), reservations)
        : undefined,
    [reservations, dateKey],
  )

  const formatRange = (reservation: Reservation) =>
    `${formatTime(new Date(reservation.startAt), i18n.language)} – ${formatTime(
      new Date(reservation.endAt),
      i18n.language,
    )}`

  const handleConfirmCancel = () => {
    if (!cancelTarget || !user) return

    cancelReservation.mutate(
      { id: cancelTarget.id, userEmail: user.email },
      {
        onSuccess: () => {
          setCancelTarget(null)
          toast.success(t('roomDetails.canceled'))
        },
        onError: (error) => {
          toast.error(
            t(
              getApiErrorKey(
                error instanceof ApiError ? error.code : undefined,
              ),
            ),
          )
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          {t('roomDetails.schedule')}
        </h3>
        <DatePicker
          label={t('roomDetails.date')}
          value={dateKey}
          onChange={onDateKeyChange}
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
          {schedule.map((slot) => {
            const reservation = slot.reservation
            const ownedByUser =
              reservation !== null &&
              user !== null &&
              isReservationOwner(reservation, user.email)

            return (
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
                {reservation && (
                  <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {reservation.responsible}
                  </span>
                )}
                {reservation && ownedByUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCancelTarget(reservation)}
                    aria-label={t('roomDetails.cancel')}
                    className="ml-auto px-2 text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                )}
                {slot.status === 'free' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReserveSlot(slot.startAt)}
                    className="ml-auto px-2 text-primary hover:bg-primary/10"
                  >
                    <CalendarPlus size={16} aria-hidden="true" />
                    {t('newReservation.reserve')}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title={t('roomDetails.cancelTitle')}
      >
        {cancelTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t('roomDetails.cancelDescription', {
                time: formatRange(cancelTarget),
                room: roomName,
              })}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setCancelTarget(null)}>
                {t('roomDetails.keep')}
              </Button>
              <Button
                variant="danger"
                isLoading={cancelReservation.isPending}
                onClick={handleConfirmCancel}
              >
                {t('roomDetails.cancel')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
