import { Inbox, Search, SearchX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  ScrollToTopButton,
} from '../../components/ui'
import { useDebouncedValue, useRooms } from '../../hooks'
import { countActiveRoomFilters, filterRooms } from '../../utils'
import { FiltersPanel } from './components/FiltersPanel'
import { RoomCard } from './components/RoomCard'
import { RoomCardSkeleton } from './components/RoomCardSkeleton'
import { useRoomFilters } from './useRoomFilters'

const SKELETON_COUNT = 6

function Home() {
  const { t } = useTranslation()
  const { data: rooms, isPending, isError, refetch } = useRooms()
  const { filters, setFilters, clearFilters } = useRoomFilters()
  const [searchText, setSearchText] = useState(filters.query)
  const [previousQuery, setPreviousQuery] = useState(filters.query)
  const debouncedSearch = useDebouncedValue(searchText, 300)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Syncs the input when the URL changes from outside (back/forward, clear)
  if (filters.query !== previousQuery) {
    setPreviousQuery(filters.query)
    setSearchText(filters.query)
  }

  useEffect(() => {
    if (debouncedSearch === filters.query) return
    if (debouncedSearch !== searchText) return
    setFilters({ query: debouncedSearch })
  }, [debouncedSearch, filters.query, searchText, setFilters])

  const filteredRooms = useMemo(
    () => (rooms ? filterRooms(rooms, filters) : undefined),
    [rooms, filters],
  )
  const activeFilterCount = countActiveRoomFilters(filters)
  const hasActiveFilters = activeFilterCount > 0 || filters.query.trim() !== ''

  const handleClear = () => {
    setSearchText('')
    clearFilters()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          {t('rooms.title')}
        </h1>
        {rooms && filteredRooms && (
          <span className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? t('filters.results', {
                  count: filteredRooms.length,
                  total: rooms.length,
                })
              : t('rooms.count', { count: rooms.length })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            aria-hidden="true"
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label={t('filters.searchLabel')}
            placeholder={t('filters.searchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="w-full pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            {t('filters.clear')}
          </Button>
        )}
      </div>

      <FiltersPanel
        filters={filters}
        onChange={setFilters}
        className="max-sm:hidden"
      />

      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} className="h-full overflow-y-auto">
          {isPending && (
            <div
              role="status"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
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
            filteredRooms &&
            (rooms.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={t('rooms.empty.title')}
                description={t('rooms.empty.description')}
              />
            ) : filteredRooms.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t('filters.noResults.title')}
                description={t('filters.noResults.description')}
                action={
                  <Button variant="secondary" onClick={handleClear}>
                    {t('filters.clear')}
                  </Button>
                }
              />
            ) : (
              <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => (
                  <li key={room.id}>
                    <RoomCard room={room} />
                  </li>
                ))}
              </ul>
            ))}
        </div>
        <ScrollToTopButton targetRef={scrollRef} />
      </div>
    </div>
  )
}

export default Home
