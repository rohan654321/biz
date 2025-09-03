import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Exhibitor Dashboard",
  description: "Manage your exhibition presence and business opportunities",
}

export default function ExhibitorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
