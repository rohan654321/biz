import EventDashboardPage from '../layout'

interface PageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function Page({ params }: PageProps) {
  return <EventDashboardPage params={params} />
}

