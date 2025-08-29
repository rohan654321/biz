"use client"

// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth-options"
// import { redirect } from "next/navigation"
import { UserDashboard } from "../user-dashboard"

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string
  company?: string
  jobTitle?: string
  location?: {
    address: string
    city: string
    state: string
    country: string
  }
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  _count?: {
    eventsAttended: number
    eventsOrganized: number
    connections: number
  }
}

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  venue?: {
    name: string
    location: {
      city: string
    }
  }
  status: string
  type: string
}

interface Connection {
  id: string
  firstName: string
  lastName: string
  jobTitle?: string
  company?: string
  avatar?: string
}

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    firstName: string
    lastName: string
    avatar?: string
  }
  isRead: boolean
}

export default async function DashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // const session = await getServerSession(authOptions)

  // if (!session) {
  //   redirect("/login")
  // }

  // // Check if user is trying to access their own dashboard or if they're an admin
  // if (session.user.id !== id && session.user.role !== "admin") {
  //   redirect("/login")
  // }

  return <UserDashboard userId={id} />
}
