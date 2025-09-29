import { Suspense } from "react"
import { EventInfo } from "../info"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface EventPageProps {
  params: Promise<{ id: string }>
}

function EventInfoSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default async function EventPage({ params }: EventPageProps) {
  const {id} = await params
  return (
    <Suspense fallback={<EventInfoSkeleton />}>
      <EventInfo eventId={id} />
    </Suspense>
  )
}
