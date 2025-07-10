

import AdminDashboard from "./sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "superadmin") {
    redirect("/login")
  }
  return <AdminDashboard />
}
