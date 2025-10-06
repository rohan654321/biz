import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientLayout } from "./client-layout"

export const metadata: Metadata = {
  title: "Biz Trade Fairs",
  description: "Discover global trade fairs, connect with opportunities, and grow your business network.",
  generator: "Biz Trade Fairs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ClientLayout>
      </body>
    </html>
  )
}
