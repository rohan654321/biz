"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Mail, MapPin, Clock, IndianRupee } from "lucide-react"
import EventHero from "./EventHero"
import EventImageGallery from "@/components/event-image-gallery"
import { Plus } from "lucide-react"
import { Share2 } from "lucide-react"
import { Bookmark } from "lucide-react"
import { useEffect, useState } from "react"
import ExhibitorsTab from "./exhibitors-tab"
import SpeakersTab from "./speakers-tab"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AddReviewCard from "@/components/AddReviewCard"
import { Edit2 } from "lucide-react";


interface EventPageProps {
  params: { id: string }
}


export default function EventPage({ params }: EventPageProps) {
  // ALL useState calls must be at the top, before any conditional logic
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [averageRating, setAverageRating] = useState(0) // Add this state
  const [totalReviews, setTotalReviews] = useState(0) // Add this state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState("");
  const [editingTags, setEditingTags] = useState(false);
  const [tagsText, setTagsText] = useState(""); // Will hold comma-separated tags



  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  // Update editable fields when event is fetched
  useEffect(() => {
    if (event) {
      // About section
      if (event.description) {
        setAboutText(event.description);
      }

      // Tags section
      if (event.tags) {
        setTagsText(event.tags.join(", ")); // Convert array to comma-separated string
      }
    }
  }, [event]);


  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        setError(null)

        const eventId = params.id
        const res = await fetch(`/api/events/${eventId}`)

        if (!res.ok) {
          if (res.status === 404) setError("Event not found")
          else throw new Error(`HTTP error! status: ${res.status}`)
          return
        }

        const data = await res.json()

        // Map API fields to frontend expected structure
        setEvent({
          ...data,
          isRegistrationOpen: data.isAvailable,
          spotsRemaining: data.availableTickets,
          images: data.images || [data.bannerImage].filter(Boolean),
          category: data.category || "General",
          tags: data.tags || [],
          venue: data.venue || {},
          currency: "₹",
        })

        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.reviewCount || 0)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params])


  // Check if event is saved on load
  useEffect(() => {
    if (event?.id && session?.user?.id) {
      checkIfSaved()
    }
  }, [event?.id, session?.user?.id])

  const checkIfSaved = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/save`)
      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.isSaved)
      }
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const handleSaveEvent = async () => {
    if (!session) {
      alert("Please log in to save events")
      router.push("/login")
      return
    }

    setSaving(true)
    try {
      const method = isSaved ? "DELETE" : "POST"
      const response = await fetch(`/api/events/${event.id}/save`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsSaved(!isSaved)
        toast({
          title: isSaved ? "Event removed" : "Event saved",
          description: isSaved ? "Event removed from your saved list" : "Event added to your saved events",
        })
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleVisitClick = async () => {
    if (!session) {
      alert("Authentication Required\nPlease log in to express interest in this event")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/events/${event.id}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "attendee",
          userId: session.user.id,
          eventId: event.id,
        }),
      })

      if (response.ok) {
        alert("Your visit request has been sent to the organizer successfully!")
      } else {
        throw new Error("Failed to record interest")
      }
    } catch (error) {
      alert("Failed to record your interest. Please try again.")
    }
  }

  const handleExhibitClick = async () => {
    if (!session) {
      alert("Authentication Required\nPlease log in to express interest in exhibiting")
      router.push("/login")
      return
    }

    try {
      const response = await fetch(`/api/events/${event.id}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "exhibitor",
          userId: session.user.id,
          eventId: event.id,
        }),
      })

      if (response.ok) {
        alert("Your exhibition request has been sent to the organizer successfully!")
      } else {
        throw new Error("Failed to record interest")
      }
    } catch (error) {
      alert("Failed to record your interest. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading event: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Event not found</p>
      </div>
    )
  }

  const followers = Array(6).fill({
    name: "Ramesh S",
    company: "Mobile Technology",
    location: "Chennai, India",
    imageUrl: "/placeholder.svg?height=80&width=80&text=Profile",
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-7xl bg-gray-50 py-8 mx-10">
      <EventHero event={event} />

      <div className=" max-w-8xl mx-auto py-4">
        <div className="bg-white rounded-sm  p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Tag Name will be updated by backend</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{event.address || event.location || "Location TBA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const query = encodeURIComponent(event.address || event.location || "Location");
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Get Directions
                  </Button>

                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">
                      {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    {totalReviews > 0 && (
                      <span className="ml-1 text-sm text-gray-500">
                        ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEvent}
                    disabled={saving}
                    className={isSaved ? "text-blue-600" : ""}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: event.title,
                          text: "Check out this event!",
                          url: window.location.href,
                        })
                          .catch((err) => console.error("Error sharing:", err));
                      } else {
                        alert("Sharing is not supported in this browser.");
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
{/* 
            <div className="flex flex-col gap-4 pr-4 lg:pr-4">
              <p className="text-center text-gray-700 font-medium">Interested in this Event ?</p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button variant="outline" className="flex-1 border-gray-300 bg-transparent" onClick={handleVisitClick}>
                  Visit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-300 bg-transparent text-blue-600 hover:text-blue-700"
                  onClick={handleExhibitClick}
                >
                  Exhibit
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs defaultValue="about" className="w-full">
              <div className="bg-white rounded-lg mb-6 shadow-sm border border-gray-200">
                <TabsList className="grid w-full grid-cols-9 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="exhibitors"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Exhibitors
                  </TabsTrigger>
                  <TabsTrigger
                    value="space-cost"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Space Cost
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="brochure"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Brochure
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Organizer
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Review
                  </TabsTrigger> */}
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
                <EventImageGallery images={event.images || [event.bannerImage].filter(Boolean)} />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <span>About the Event</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSection(editingSection === "about" ? null : "about")}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {editingSection === "about" && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                const res = await fetch(`/api/events/${event.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ description: aboutText }),
                                });

                                const data = await res.json(); // Optional: response from backend

                                // Update local state to reflect the change immediately
                                setEvent((prev: any) => ({ ...prev, description: aboutText }));

                                toast({ title: "Saved", description: "About section updated" });

                                setEditingSection(null); // Exit editing mode
                              } catch (err) {
                                console.error(err);
                                toast({ title: "Error", description: "Failed to save changes" });
                              }
                            }}
                          >
                            Save
                          </Button>

                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {editingSection === "about" ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        rows={5}
                      />
                    ) : (
                      <p className="text-gray-700 mb-4 leading-relaxed">{aboutText}</p>
                    )}
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-blue-700">Listed In</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTags(!editingTags)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {editingTags && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                const newTags = tagsText.split(",").map(tag => tag.trim()).filter(Boolean);

                                const res = await fetch(`/api/events/${event.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ tags: newTags }),
                                });

                                if (!res.ok) throw new Error("Failed to update tags");

                                setEvent((prev: any) => ({ ...prev, tags: newTags }));
                                setEditingTags(false);
                                toast({ title: "Saved", description: "Tags updated successfully" });
                              } catch (err) {
                                console.error(err);
                                toast({ title: "Error", description: "Failed to save tags" });
                              }
                            }}
                          >
                            Save
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingTags ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        value={tagsText}
                        onChange={(e) => setTagsText(e.target.value)}
                        placeholder="Enter tags separated by commas"
                        rows={2}
                      />
                    ) : event.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No tags available</p>
                    )}
                  </CardContent>
                </Card>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Event Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.endDate)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-semibold text-blue-600">{event.timezone}</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        Registration Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration Start:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.registrationStart)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Registration End:</span>
                        <span className="font-semibold text-blue-600">{formatDate(event.registrationEnd)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={event.isRegistrationOpen ? "default" : "secondary"}>
                          {event.isRegistrationOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle>Event Type</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-700">{event.isVirtual ? "Virtual Event" : "Physical Event"}</p>
                      {event.isVirtual && event.virtualLink && (
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mt-2 block"
                        >
                          Join Virtual Event
                        </a>
                      )}
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg pb-4">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle>Capacity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {event.maxAttendees ? (
                          <>
                            <p className="text-gray-700">Max Attendees: {event.maxAttendees}</p>
                            {event.spotsRemaining !== null && (
                              <p className="text-gray-700">Spots Remaining: {event.spotsRemaining}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-700">Unlimited capacity</p>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </div>

                {/* <Card className="border border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-base">Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 flex items-center justify-center">
                        <Image
                          src={event.organizer?.avatar || "/placeholder.svg?height=96&width=96&text=Organizer"}
                          alt="Organizer"
                          width={96}
                          height={96}
                          className="object-contain rounded shadow-sm"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900 text-sm">
                            {event.organizer?.firstName || "Event Organizer"}
                          </h3>
                          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">Professional Event Organizer</p>
                        <p className="text-sm text-blue-900 mt-1">Contact for more details</p>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                        <p className="text-gray-700 font-medium">Event Venue</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.location || "Venue details will be updated soon"}
                        </p>
                        {event.address && <p className="text-xs text-gray-500 mt-1">{event.address}</p>}
                        <Button className="mt-3" size="sm">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
                {/* <AddReviewCard eventId={event.id} /> */}
              </TabsContent>

              <TabsContent value="exhibitors">
                <ExhibitorsTab eventId={event.id} />
              </TabsContent>

              <TabsContent value="space-cost">
                <Card>
                  <CardHeader>
                    <CardTitle>Exhibition Space Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.exhibitionSpaces?.length > 0 ? (
                      event.exhibitionSpaces.map((space: any, index: any) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border"
                        >
                          <div>
                            <span className="font-medium">{space.name}</span>
                            <p className="text-sm text-gray-600">{space.description}</p>
                            <p className="text-xs text-gray-500">
                              Minimum area: {space.minArea} {space.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-blue-600">
                              {event.currency} {space.basePrice.toLocaleString()}
                            </span>
                            {space.pricePerSqm > 0 && (
                              <p className="text-sm text-gray-600">
                                + {event.currency} {space.pricePerSqm}/{space.unit}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No exhibition space information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Floor plan will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="brochure">
                <Card>
                  <CardHeader>
                    <CardTitle>Brochure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Brochure will be displayed here</p>
                    </div>
                  </CardContent>
                  <button className="mx-5 mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Download Brochure
                  </button>
                </Card>
              </TabsContent>

              <TabsContent value="venue">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{event.venue?.firstName || "Venue Name"}</h4>
                        <p className="text-gray-600">{event.address || "Address not available"}</p>
                        <p className="text-gray-600">
                          {event.city && event.state ? `${event.city}, ${event.state}` : "Location TBA"}
                        </p>
                        {event.country && <p className="text-gray-600">{event.country}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="speakers">
                <SpeakersTab eventId={event.id} />
              </TabsContent>

              <TabsContent value="organizer">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={event.organizer?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">
                          {event.organizer?.firstName?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{event.organizer?.firstName || "Event Organizer"}</h4>
                        <p className="text-gray-600 mb-3">Professional event organizer and manager</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span>{event.organizer?.email || "Contact via platform"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddReviewCard eventId={event.id} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>


        </div>
      </div>
    </div>
  )
}
