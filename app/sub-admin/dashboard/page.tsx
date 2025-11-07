"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Shield, Calendar } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

export default function SubAdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem("adminUser")
      const adminToken = localStorage.getItem("adminToken")

      if (userData && adminToken) {
        const user = JSON.parse(userData)
        // Check if user is sub-admin
        if (user.role === "SUB_ADMIN") {
          setUser(user)
        } else {
          router.push("/sub-admin/login")
        }
      } else {
        router.push("/sub-admin/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/sub-admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage
      localStorage.removeItem("adminUser")
      localStorage.removeItem("adminToken")
      
      toast.success("Logged out successfully")
      router.push("/sub-admin/login")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Sub Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-green-600" />
                Welcome, {user.name}!
              </CardTitle>
              <CardDescription>
                You have successfully logged in as a Sub Admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      User Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Sub Admin</span></p>
                    </div>
                  </CardContent>
                </Card>

                {/* Permissions Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      You have access to {user.permissions?.length || 0} permissions
                    </p>
                    <div className="max-h-32 overflow-y-auto">
                      {user.permissions && user.permissions.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {user.permissions.slice(0, 5).map((permission, index) => (
                            <li key={index} className="text-gray-700">• {permission}</li>
                          ))}
                          {user.permissions.length > 5 && (
                            <li className="text-gray-500">+ {user.permissions.length - 5} more...</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No specific permissions assigned</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Login Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Session:</span>
                        <span className="text-sm text-gray-900">Live</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Login:</span>
                        <span className="text-sm text-gray-900">Just now</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Test Section */}
          <Card>
            <CardHeader>
              <CardTitle>Login Test Successful! 🎉</CardTitle>
              <CardDescription>
                Your sub-admin login is working perfectly. You can now proceed to build your actual dashboard features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Authentication Successful
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your sub-admin credentials are verified and you have access to the dashboard.
                        The login system is working correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}