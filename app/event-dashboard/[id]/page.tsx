import EventSidebar from "../event-layout"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  return <EventSidebar eventId={id} />
}