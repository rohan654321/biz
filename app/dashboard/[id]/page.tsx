import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { UserDashboard } from "../user-dashboard"
import { NameBanner } from "../NameBanner"
import Navbar from "../navbar"

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
  if (session.user.id !== id && session.user.role !== "ATTENDEE") {
    redirect("/login")
  }

  return (
    <div>
      <Navbar />
      <NameBanner
        name={session.user.name || "User"}
        designation={
          session.user.role === "ATTENDEE"
            ? "Visitor"
            : session.user.role || ""
        }
      />
      <UserDashboard userId={id} />
    </div>
  )
}
