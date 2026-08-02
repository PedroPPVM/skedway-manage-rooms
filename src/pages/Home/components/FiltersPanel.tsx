import { useTranslation } from 'react-i18next'
import { Checkbox, Select } from '../../../components/ui'
import { ROOM_RESOURCES } from '../../../types'
import type { RoomResource } from '../../../types'
import { cn } from '../../../utils'
import type { RoomFilters } from '../../../utils'

const CAPACITY_OPTIONS = [2, 4, 8, 12, 16, 20]

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

  const toggleResource = (resource: RoomResource, checked: boolean) => {
    onChange({
      resources: checked
        ? [...filters.resources, resource]
        : filters.resources.filter((current) => current !== resource),
    })
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6',
        className,
      )}
    >
      <Select
        label={t('filters.capacity')}
        value={filters.minCapacity ?? ''}
        onChange={(event) =>
          onChange({
            minCapacity: event.target.value ? Number(event.target.value) : null,
          })
        }
        className="sm:w-44"
      >
        <option value="">{t('filters.capacityAny')}</option>
        {CAPACITY_OPTIONS.map((capacity) => (
          <option key={capacity} value={capacity}>
            {t('filters.capacityOption', { count: capacity })}
          </option>
        ))}
      </Select>

      <div className="flex items-center sm:h-10 sm:self-end">
        <Checkbox
          label={t('filters.onlyAvailable')}
          checked={filters.onlyAvailable}
          onChange={(event) =>
            onChange({ onlyAvailable: event.target.checked })
          }
        />
      </div>

      <fieldset className="sm:order-last sm:w-full">
        <legend className="mb-2 text-sm font-medium text-foreground">
          {t('filters.resources')}
        </legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {ROOM_RESOURCES.map((resource) => (
            <Checkbox
              key={resource}
              label={t(`rooms.resources.${resource}`)}
              checked={filters.resources.includes(resource)}
              onChange={(event) =>
                toggleResource(resource, event.target.checked)
              }
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
