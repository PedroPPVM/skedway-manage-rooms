import { useTranslation } from 'react-i18next'
import { Input, MultiSelect, ToggleChip } from '../../../components/ui'
import { ROOM_RESOURCES } from '../../../types'
import { cn } from '../../../utils'
import type { RoomFilters } from '../../../utils'

interface FiltersPanelProps {
  filters: RoomFilters
  onChange: (update: Partial<RoomFilters>) => void
  className?: string
}

export function FiltersPanel({
  filters,
  onChange,
  className,
}: FiltersPanelProps) {
  const { t } = useTranslation()

  const resourceOptions = ROOM_RESOURCES.map((resource) => ({
    value: resource,
    label: t(`rooms.resources.${resource}`),
  }))

  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end', className)}
    >
      <Input
        type="number"
        min={1}
        inputMode="numeric"
        label={t('filters.capacity')}
        placeholder={t('filters.capacityPlaceholder')}
        value={filters.minCapacity ?? ''}
        onChange={(event) =>
          onChange({
            minCapacity: event.target.value
              ? Math.max(1, Number(event.target.value))
              : null,
          })
        }
        className="sm:w-40"
      />
      <MultiSelect
        label={t('filters.resources')}
        options={resourceOptions}
        value={filters.resources}
        onChange={(resources) => onChange({ resources })}
        placeholder={t('filters.resourcesPlaceholder')}
        className="sm:w-72"
      />
      <ToggleChip
        pressed={filters.onlyAvailable}
        onClick={() => onChange({ onlyAvailable: !filters.onlyAvailable })}
      >
        {t('filters.onlyAvailable')}
      </ToggleChip>
    </div>
  )
}
