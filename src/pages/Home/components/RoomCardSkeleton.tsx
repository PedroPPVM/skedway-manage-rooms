import { Card, Skeleton } from '../../../components/ui'

export function RoomCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </Card>
  )
}
