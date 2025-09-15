"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar as CalendarIcon, MapPin, Plus, Users, Heart, Eye,Bookmark, Store, MessageCircle, Filter, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  startDate: string
  endDate: string
  location?: string
  city?: string
  state?: string
  status: string
  type: string
  description?: string
  shortDescription?: string
  bannerImage?: string
  thumbnailImage?: string
  organizer?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    company?: string
  }
  leadId?: string
  leadStatus?: string
  leadType?: string
  contactedAt?: string
  followUpDate?: string
  leadNotes?: string
  currentRegistrations?: number
  maxAttendees?: number
}

interface EventsSectionProps {
  userId?: string
}

export function EventsSection({ userId }: EventsSectionProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([])
  const [interestedLoading, setInterestedLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  })
  const [showCalendarFilter, setShowCalendarFilter] = useState(false)

  // Add this to your EventsSection component
const [savedEvents, setSavedEvents] = useState<Event[]>([])
const [savedLoading, setSavedLoading] = useState(true)


  // Use session user ID if no userId prop is provided
  const targetUserId = userId || session?.user?.id

// Add this useEffect to fetch saved events
useEffect(() => {
  if (status === "loading") return
  if (!targetUserId) return
  
  fetchSavedEvents()
}, [targetUserId, status])

const fetchSavedEvents = async () => {
  if (!targetUserId) return

  try {
    setSavedLoading(true)
    const response = await fetch(`/api/users/${targetUserId}/saved-events`)
    
    if (!response.ok) {
      throw new Error("Failed to fetch saved events")
    }

    const data = await response.json()
    setSavedEvents(data.events || [])
  } catch (err) {
    console.error("Error fetching saved events:", err)
    setError(err instanceof Error ? err.message : "Error loading saved events")
  } finally {
    setSavedLoading(false)
  }
}


  useEffect(() => {
    if (status === "loading") return
    if (!targetUserId) {
      setError("User not authenticated")
      setInterestedLoading(false)
      return
    }
    fetchInterestedEvents()
  }, [targetUserId, status])

  const fetchInterestedEvents = async () => {
    if (!targetUserId) return

    try {
      setInterestedLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${targetUserId}/interested-events`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You need to be logged in to view this information")
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to view these events")
        }
        throw new Error(`Failed to fetch interested events: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.events && Array.isArray(data.events)) {
        setInterestedEvents(data.events)
      } else {
        console.error("Unexpected data structure:", data)
        setInterestedEvents([])
      }
    } catch (err) {
      console.error("Error fetching interested events:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setInterestedLoading(false)
    }
  }

  const getLeadBadgeVariant = (status: string) => {
    switch (status) {
      case "NEW": return "default"
      case "CONTACTED": return "secondary"
      case "QUALIFIED": return "outline"
      case "CONVERTED": return "secondary"
      case "FOLLOW_UP": return "outline"
      case "REJECTED": return "destructive"
      default: return "outline"
    }
  }

  const getLeadIcon = (type: string) => {
    switch (type) {
      case "ATTENDEE": return <Eye className="w-4 h-4" />
      case "EXHIBITOR": return <Store className="w-4 h-4" />
      case "SPEAKER": return <Users className="w-4 h-4" />
      case "SPONSOR": return <Heart className="w-4 h-4" />
      case "PARTNER": return <MessageCircle className="w-4 h-4" />
      default: return <Heart className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  // Filter events based on selected date range
  const filterEventsByDate = (events: Event[]) => {
    if (!dateFilter.from && !dateFilter.to) return events
    
    return events.filter(event => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = new Date(event.endDate)
      
      // If only from date is selected
      if (dateFilter.from && !dateFilter.to) {
        return eventStartDate >= dateFilter.from || eventEndDate >= dateFilter.from
      }
      
      // If only to date is selected
      if (!dateFilter.from && dateFilter.to) {
        return eventStartDate <= dateFilter.to || eventEndDate <= dateFilter.to
      }
      
      // If both from and to dates are selected
      if (dateFilter.from && dateFilter.to) {
        return (
          (eventStartDate >= dateFilter.from && eventStartDate <= dateFilter.to) ||
          (eventEndDate >= dateFilter.from && eventEndDate <= dateFilter.to) ||
          (eventStartDate <= dateFilter.from && eventEndDate >= dateFilter.to)
        )
      }
      
      return true
    })
  }

  const clearDateFilter = () => {
    setDateFilter({ from: undefined, to: undefined })
  }

  const filteredEvents = filterEventsByDate(interestedEvents)

  if (status === "loading" || interestedLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Interested Events</h1>
        <Button
          onClick={() => router.push("/event")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Find Events
        </Button>
      </div>

      {/* Calendar Filter Section */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filter by Date</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalendarFilter(!showCalendarFilter)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showCalendarFilter ? 'Hide Filter' : 'Show Filter'}
          </Button>
        </div>

        {showCalendarFilter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Calendar
                mode="range"
                selected={{
                  from: dateFilter.from,
                  to: dateFilter.to
                }}
                onSelect={(range) => {
                  setDateFilter({
                    from: range?.from,
                    to: range?.to
                  })
                }}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateFilter.from ? format(dateFilter.from, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setDateFilter(prev => ({ ...prev, from: date }))
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateFilter.to ? format(dateFilter.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setDateFilter(prev => ({ ...prev, to: date }))
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearDateFilter}
                  className="flex items-center gap-2"
                  disabled={!dateFilter.from && !dateFilter.to}
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </Button>
                
                <Button 
                  variant="default"
                  onClick={() => setShowCalendarFilter(false)}
                >
                  Apply Filter
                </Button>
              </div>
              
              {(dateFilter.from || dateFilter.to) && (
                <div className="text-sm text-gray-600 mt-2">
                  <p>Showing events from: {dateFilter.from ? formatDate(dateFilter.from.toISOString()) : 'any date'}</p>
                  <p>to: {dateFilter.to ? formatDate(dateFilter.to.toISOString()) : 'any date'}</p>
                  <p className="font-medium mt-1">
                    {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} match your filter
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
    <TabsTrigger value="all">
      All Interests ({filteredEvents.length})
    </TabsTrigger>
    <TabsTrigger value="saved">
      Saved ({savedEvents.length})
    </TabsTrigger>
    <TabsTrigger value="upcoming">
      Upcoming ({filteredEvents.filter(e => isUpcoming(e.startDate)).length})
    </TabsTrigger>
    <TabsTrigger value="followup">
      Follow-up ({filteredEvents.filter(e => e.followUpDate && new Date(e.followUpDate) >= new Date()).length})
    </TabsTrigger>
  </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge variant={getLeadBadgeVariant(event.leadStatus || "NEW")}>
                          {event.leadStatus}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getLeadIcon(event.leadType || "ATTENDEE")}
                          {event.leadType}
                        </Badge>
                        {isUpcoming(event.startDate) && (
                          <Badge variant="secondary">Upcoming</Badge>
                        )}
                      </div>

                      {event.shortDescription && (
                        <p className="text-gray-600 mb-3 text-sm">{event.shortDescription}</p>
                      )}

                      <div className="flex items-center gap-4 text-gray-600 text-sm mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </div>

                        {(event.location || event.city) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location || `${event.city}${event.state ? `, ${event.state}` : ''}`}
                          </div>
                        )}

                        <Badge variant="outline">{event.type}</Badge>
                      </div>

                      {event.organizer && (
                        <div className="text-sm text-gray-600 mb-2">
                          Organized by: {event.organizer.firstName} {event.organizer.lastName}
                          {event.organizer.company && ` (${event.organizer.company})`}
                        </div>
                      )}

                      {event.followUpDate && new Date(event.followUpDate) >= new Date() && (
                        <div className="mt-2 text-sm text-orange-600 font-medium">
                          Follow up: {formatDate(event.followUpDate)}
                        </div>
                      )}

                      {event.contactedAt && (
                        <div className="mt-1 text-sm text-gray-500">
                          Contacted: {formatDate(event.contactedAt)}
                        </div>
                      )}

                      {event.leadNotes && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          Notes: {event.leadNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/event/${event.id}`)}
                      >
                        View Event
                      </Button>

                      <Button variant="ghost" size="sm">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">
                  {dateFilter.from || dateFilter.to 
                    ? "No events match your filter criteria." 
                    : "No interested events yet."}
                </p>
                <p className="text-sm text-gray-500">
                  {dateFilter.from || dateFilter.to 
                    ? "Try adjusting your date range filter."
                    : "Visit event pages and click \"I'm Interested\" to track events here."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredEvents.filter(e => isUpcoming(e.startDate)).map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge variant="secondary">Upcoming</Badge>
                      <Badge variant={getLeadBadgeVariant(event.leadStatus || "NEW")}>
                        {event.leadStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(event.startDate)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    View Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="followup" className="space-y-4">
          {filteredEvents.filter(e => e.followUpDate && new Date(e.followUpDate) >= new Date()).map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Follow-up Due
                      </Badge>
                    </div>
                    <div className="text-sm text-orange-600 font-medium mb-2">
                      Follow up: {event.followUpDate && formatDate(event.followUpDate)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Contact</Button>
                    <Button variant="ghost" size="sm">Mark Done</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

          {/* Add this new tab content */}
  <TabsContent value="saved" className="space-y-4">
    {savedEvents.length > 0 ? (
      savedEvents.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <Badge variant="secondary">Saved</Badge>
                </div>
                {/* ... rest of event card content ... */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <Card>
        <CardContent className="p-6 text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600 mb-4">No saved events yet.</p>
          <p className="text-sm text-gray-500">
            Click the bookmark icon on event pages to save them here.
          </p>
        </CardContent>
      </Card>
    )}
  </TabsContent>
      </Tabs>
    </div>
  )
}