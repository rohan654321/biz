import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import {ExhibitorDashboard}  from "../speaker-dashboard"

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Check if user is trying to access their own dashboard or if they're admin
  if (session.user.id !== id && session.user.role !== "SPEAKER") {
    redirect("/login")
  }

  return <ExhibitorDashboard userId={id} />
}
