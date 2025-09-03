import { Skeleton } from "@/components/ui/skeleton"

export function ExhibitorDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExhibitorDashboardSkeleton
