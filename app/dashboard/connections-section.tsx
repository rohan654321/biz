"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Users } from "lucide-react"

interface Connection {
  id: string
  firstName: string
  lastName: string
  jobTitle?: string
  company?: string
  avatar?: string
  mutualConnections?: number
}

interface ConnectionsSectionProps {
  userId: string
}

export function ConnectionsSection({ userId }: ConnectionsSectionProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConnections()
  }, [userId])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}/connections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }

      const data = await response.json()
      setConnections(data.connections)
    } catch (err) {
      console.error("Error fetching connections:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredConnections = connections.filter(
    (connection) =>
      connection.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connection.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchConnections}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search connections..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Find People</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {connection.firstName[0]}
                    {connection.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">
                  {connection.firstName} {connection.lastName}
                </h3>
                {connection.jobTitle && <p className="text-sm text-gray-600 mb-1">{connection.jobTitle}</p>}
                {connection.company && <p className="text-sm text-gray-500 mb-2">{connection.company}</p>}
                {connection.mutualConnections && (
                  <p className="text-xs text-blue-600 mb-4">{connection.mutualConnections} mutual connections</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No connections found matching your search." : "No connections found."}
            </p>
            <Button className="mt-4">Find People to Connect</Button>
          </div>
        )}
      </div>
    </div>
  )
}
