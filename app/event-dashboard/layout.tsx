import type React from "react"
import EventLayout from "./event-layout"

interface EventLayoutPageProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function EventLayoutPage({ children, params }: EventLayoutPageProps) {
  const { id } = await params

  return <EventLayout eventId={id}>{children}</EventLayout>
}
