import { Suspense } from "react"
import { ExhibitorDashboard } from "@/app/exhibitor-dashboard/exhibitorlayout"
import { ExhibitorDashboardSkeleton } from "./loading"

interface ExhibitorDashboardPageProps {
  params: Promise<{ id: string }>
}

export default async function ExhibitorDashboardPage({ params }: ExhibitorDashboardPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ExhibitorDashboardSkeleton />}>
        <ExhibitorDashboard userId={id} />
      </Suspense>
    </div>
  )
}
