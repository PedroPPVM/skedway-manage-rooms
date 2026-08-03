import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useEffect, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button, DatePicker, Input, Select } from '../../../components/ui'
import { useToast } from '../../../contexts/toast'
import { useUser } from '../../../contexts/user'
import { useCreateReservation, useReservations } from '../../../hooks'
import { getApiErrorKey } from '../../../i18n/api-errors'
import { ApiError } from '../../../services/http'
import {
  buildDaySchedule,
  formatTime,
  getAvailableDurations,
  getFreeStartTimes,
  parseDateKey,
} from '../../../utils'

function createReservationSchema(t: TFunction) {
  return z.object({
    responsible: z
      .string()
      .trim()
      .min(2, t('newReservation.validation.responsible')),
    dateKey: z.string(),
    startAt: z.string().min(1, t('newReservation.validation.startTime')),
    durationMinutes: z.string().min(1),
  })
}

type ReservationFormValues = z.infer<ReturnType<typeof createReservationSchema>>

function formatDuration(minutes: number, t: TFunction): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return t('newReservation.durationMinutes', { count: rest })
  if (rest === 0) return t('newReservation.durationHours', { count: hours })
  return t('newReservation.durationHoursMinutes', { hours, minutes: rest })
}

interface ReservationFormProps {
  roomId: string
  initialDateKey: string
  initialStartAt: string | null
  onBack: () => void
}

export function ReservationForm({
  roomId,
  initialDateKey,
  initialStartAt,
  onBack,
}: ReservationFormProps) {
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const toast = useToast()
  const createReservation = useCreateReservation()

  const schema = useMemo(() => createReservationSchema(t), [t])
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      responsible: user?.name ?? '',
      dateKey: initialDateKey,
      startAt: initialStartAt ?? '',
      durationMinutes: '30',
    },
  })

  const dateKey = useWatch({ control, name: 'dateKey' })
  const startAt = useWatch({ control, name: 'startAt' })
  const durationMinutes = useWatch({ control, name: 'durationMinutes' })

  const { data: reservations } = useReservations({ roomId, date: dateKey })

  const freeStartTimes = useMemo(
    () =>
      reservations
        ? getFreeStartTimes(
            buildDaySchedule(parseDateKey(dateKey), reservations),
          )
        : [],
    [reservations, dateKey],
  )

  const durations = useMemo(
    () =>
      startAt && reservations
        ? getAvailableDurations(startAt, reservations)
        : [],
    [startAt, reservations],
  )

  useEffect(() => {
    if (
      startAt &&
      freeStartTimes.length > 0 &&
      !freeStartTimes.includes(startAt)
    ) {
      setValue('startAt', '')
    }
  }, [startAt, freeStartTimes, setValue])

  useEffect(() => {
    if (durations.length > 0 && !durations.includes(Number(durationMinutes))) {
      setValue('durationMinutes', String(durations[0]))
    }
  }, [durations, durationMinutes, setValue])

  const onSubmit = handleSubmit((values) => {
    if (!user) return

    const start = new Date(values.startAt)
    const endAt = new Date(
      start.getTime() + Number(values.durationMinutes) * 60_000,
    ).toISOString()

    createReservation.mutate(
      {
        roomId,
        responsible: values.responsible,
        createdByEmail: user.email,
        startAt: values.startAt,
        endAt,
      },
      {
        onSuccess: () => {
          toast.success(t('newReservation.created'))
          onBack()
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
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">
          {t('newReservation.title')}
        </h3>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t('newReservation.back')}
        </Button>
      </div>

      <Input
        label={t('newReservation.responsible')}
        placeholder={t('newReservation.responsiblePlaceholder')}
        autoComplete="name"
        error={errors.responsible?.message}
        {...register('responsible')}
      />

      <Controller
        name="dateKey"
        control={control}
        render={({ field }) => (
          <DatePicker
            label={t('newReservation.date')}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {freeStartTimes.length === 0 && reservations ? (
        <p className="text-sm text-muted-foreground">
          {t('newReservation.noTimes')}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label={t('newReservation.startTime')}
            error={errors.startAt?.message}
            {...register('startAt')}
          >
            <option value="">{t('newReservation.selectTime')}</option>
            {freeStartTimes.map((time) => (
              <option key={time} value={time}>
                {formatTime(new Date(time), i18n.language)}
              </option>
            ))}
          </Select>

          <Select
            label={t('newReservation.duration')}
            disabled={durations.length === 0}
            {...register('durationMinutes')}
          >
            {durations.map((minutes) => (
              <option key={minutes} value={minutes}>
                {formatDuration(minutes, t)}
              </option>
            ))}
          </Select>
        </div>
      )}

      <Button
        type="submit"
        isLoading={createReservation.isPending}
        disabled={freeStartTimes.length === 0}
        className="w-full"
      >
        {t('newReservation.submit')}
      </Button>
    </form>
  )
}
