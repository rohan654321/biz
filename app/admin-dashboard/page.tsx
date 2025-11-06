// app/admin-dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "./sidebar"
import Navbar from "./navbar"
import { NameBanner } from "./NameBanner"

interface SuperAdmin {
  id: string
  email: string
  name: string
  role: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("superAdminToken")
        
        if (!token) {
          router.push("/sign-in")
          return
        }

        // Verify token with backend
        const response = await fetch("/api/auth/super-admin/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })

        if (response.ok) {
          const adminData = await response.json()
          setSuperAdmin(adminData.superAdmin)
        } else {
          // Clear invalid tokens and redirect to sign-in
          localStorage.removeItem("superAdminToken")
          localStorage.removeItem("superAdmin")
          router.push("/sign-in")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/sign-in")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!superAdmin) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
  <Navbar />
  <NameBanner 
    name={superAdmin.name || "Super Admin"}
    designation="System Administrator"
    bannerImage="/admin-banner.jpg"
  />
    <AdminDashboard />
  
</div>

  )
}