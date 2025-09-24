import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"

import Navbar from "@/components/navbar"
import { NameBanner } from "@/app/dashboard/NameBanner"
import OrganizerDashboardPage from "../OrganizerDashboardPage"

interface DashboardPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params // ✅ Must await in Next.js App Router
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Only allow self or attendee
  if (session.user.id !== id && session.user.role !== "ORGANIZER") {
    redirect("/login")
  }

  return (
    <div>
      <Navbar />
      <NameBanner
        name={session.user.name || "Organizer"}
        designation={
          session.user.role || ""
        }
      />
      <OrganizerDashboardPage organizerId={id} />
    </div>
  )
}
