import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import ExhibitorDashboardClient from "../exhibitorLayout"

export default async function ExhibitorDashboardPage({ params }: { params: { id: string } }) {
  const { id } = params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Only allow own dashboard or admin
  if (session.user.id !== id && session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return <ExhibitorDashboardClient />
}
