import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import ExhibitorLayoutPage from "../exhibitorLayout"

export default async function ExhibitorDashboardPage({ params }:{ params: Promise<{ id: string }> }) {
  const { id } =await params
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  if (session.user.id !== id && session.user.role !== "EXHIBITOR") {
    redirect("/login")
  }

  return <ExhibitorLayoutPage userId={id} />
}
