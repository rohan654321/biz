import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/app/dashboard/dashboard-layout"

export default async function DashboardPage() {
  return <DashboardLayout />
}
