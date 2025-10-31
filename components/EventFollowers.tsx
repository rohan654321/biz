"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedEvent {
  _id: string
  userId: string
  eventId: string
  savedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    role?: string
    company?: string
    jobTitle?: string
  }
}

interface EventFollowersProps {
  eventId: string
}

export default function EventFollowers({ eventId }: EventFollowersProps) {
  const [followers, setFollowers] = useState<SavedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFollowers() {
      try {
        setLoading(true)
        const response = await fetch(`/api/events/${eventId}/followers`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch followers")
        }
        
        const data = await response.json()
        setFollowers(data.followers || [])
      } catch (err) {
        console.error("Error fetching followers:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchFollowers()
    }
  }, [eventId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  if (loading) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-2">
          <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Event Followers
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading followers...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-2">
          <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Event Followers
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">Error loading followers</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="border-b border-gray-100 pb-2">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Event Followers ({followers.length})
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          People who have saved this event
        </p>
      </CardHeader>

      <CardContent className="py-4">
        {followers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No followers yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Be the first to save this event!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {followers.map((follower) => (
              <div
                key={follower._id}
                className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="w-14 h-14 border-2 border-white shadow-sm mb-3">
                  <AvatarImage
                    src={follower.user?.avatar}
                    alt={`${follower.user?.firstName} ${follower.user?.lastName}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {getInitials(follower.user?.firstName || "", follower.user?.lastName || "")}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {follower.user?.firstName} {follower.user?.lastName}
                    </h3>
                    {follower.user?.role && (
                      <Badge variant="secondary" className="text-xs">
                        {follower.user.role}
                      </Badge>
                    )}
                  </div>
                  
                  {follower.user?.jobTitle && follower.user?.company && (
                    <p className="text-xs text-gray-600 leading-tight mb-2 line-clamp-2">
                      {follower.user.jobTitle} at {follower.user.company}
                    </p>
                  )}
                  
                  {/* <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Saved {formatDate(follower.savedAt)}</span>
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {followers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{followers.length}</p>
                <p className="text-gray-600">Total Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">
                  {new Set(followers.map(f => f.user?.role)).size}
                </p>
                <p className="text-gray-600">Different Roles</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}