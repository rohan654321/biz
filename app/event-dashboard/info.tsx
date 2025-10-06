"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Edit2, Trash2, Save, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ExhibitorsTab from "./exhibitors-tab"

interface EventPageProps {
  params: { id: string }
}

export default function EventPage({ params }: EventPageProps) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [aboutText, setAboutText] = useState("")
  const [editingTags, setEditingTags] = useState(false)
  const [tagsText, setTagsText] = useState("")

  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null)
  const [editingSpaceData, setEditingSpaceData] = useState<any>({})

  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (event) {
      if (event.description) {
        setAboutText(event.description)
      }
      if (event.tags) {
        setTagsText(event.tags.join(", "))
      }
    }
  }, [event])

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

  const handleDeleteExhibitor = async (exhibitorId: string) => {
    if (!confirm("Are you sure you want to remove this exhibitor?")) return

    try {
      const response = await fetch(`/api/events/${event.id}/exhibitors/${exhibitorId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvent((prev: any) => ({
          ...prev,
          exhibitorBooths: prev.exhibitorBooths.filter((booth: any) => booth.id !== exhibitorId),
        }))
        toast({
          title: "Success",
          description: "Exhibitor removed successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting exhibitor:", error)
      toast({
        title: "Error",
        description: "Failed to remove exhibitor",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSpaceCost = async (spaceId: string) => {
    try {
      const response = await fetch(`/api/events/${event.id}/exhibition-spaces/${spaceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSpaceData),
      })

      if (response.ok) {
        const updatedSpace = await response.json()
        setEvent((prev: any) => ({
          ...prev,
          exhibitionSpaces: prev.exhibitionSpaces.map((space: any) => (space.id === spaceId ? updatedSpace : space)),
        }))
        setEditingSpaceId(null)
        setEditingSpaceData({})
        toast({
          title: "Success",
          description: "Space cost updated successfully",
        })
      }
    } catch (error) {
      console.error("Error updating space cost:", error)
      toast({
        title: "Error",
        description: "Failed to update space cost",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSpeaker = async (speakerId: string) => {
    if (!confirm("Are you sure you want to remove this speaker?")) return

    try {
      const response = await fetch(`/api/events/${event.id}/speakers/${speakerId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvent((prev: any) => ({
          ...prev,
          speakerSessions: prev.speakerSessions.filter((session: any) => session.id !== speakerId),
        }))
        toast({
          title: "Success",
          description: "Speaker removed successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting speaker:", error)
      toast({
        title: "Error",
        description: "Failed to remove speaker",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLayout = async () => {
    if (!confirm("Are you sure you want to delete the layout plan?")) return

    try {
      const response = await fetch(`/api/events/${event.id}/layout`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Layout plan removed successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting layout:", error)
      toast({
        title: "Error",
        description: "Failed to delete layout plan",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBrochure = async () => {
    if (!confirm("Are you sure you want to delete the brochure?")) return

    try {
      const response = await fetch(`/api/events/${event.id}/brochure`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Brochure removed successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting brochure:", error)
      toast({
        title: "Error",
        description: "Failed to delete brochure",
        variant: "destructive",
      })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-7xl bg-gray-50 py-8 mx-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs defaultValue="about" className="w-full">
              <div className="bg-white rounded-lg mb-6 shadow-sm border border-gray-200">
                <TabsList className="grid w-full grid-cols-9 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
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
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="brochure"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Brochure
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Organizer
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
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
                          {editingSection === "about" ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
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
                                })

                                if (res.ok) {
                                  setEvent((prev: any) => ({ ...prev, description: aboutText }))
                                  toast({ title: "Saved", description: "About section updated" })
                                  setEditingSection(null)
                                }
                              } catch (err) {
                                console.error(err)
                                toast({ title: "Error", description: "Failed to save changes", variant: "destructive" })
                              }
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingSection === "about" ? (
                      <Textarea
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
                        <Button variant="ghost" size="sm" onClick={() => setEditingTags(!editingTags)}>
                          {editingTags ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </Button>
                        {editingTags && (
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                const newTags = tagsText
                                  .split(",")
                                  .map((tag) => tag.trim())
                                  .filter(Boolean)

                                const res = await fetch(`/api/events/${event.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ tags: newTags }),
                                })

                                if (res.ok) {
                                  setEvent((prev: any) => ({ ...prev, tags: newTags }))
                                  setEditingTags(false)
                                  toast({ title: "Saved", description: "Tags updated successfully" })
                                }
                              } catch (err) {
                                console.error(err)
                                toast({ title: "Error", description: "Failed to save tags", variant: "destructive" })
                              }
                            }}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingTags ? (
                      <Textarea
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
                      event.exhibitionSpaces.map((space: any) => (
                        <div key={space.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                          {editingSpaceId === space.id ? (
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium">Base Price</label>
                                <Input
                                  type="number"
                                  value={editingSpaceData.basePrice ?? space.basePrice}
                                  onChange={(e) =>
                                    setEditingSpaceData({
                                      ...editingSpaceData,
                                      basePrice: Number.parseFloat(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Price per {space.unit}</label>
                                <Input
                                  type="number"
                                  value={editingSpaceData.pricePerSqm ?? space.pricePerSqm}
                                  onChange={(e) =>
                                    setEditingSpaceData({
                                      ...editingSpaceData,
                                      pricePerSqm: Number.parseFloat(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleUpdateSpaceCost(space.id)}>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSpaceId(null)
                                    setEditingSpaceData({})
                                  }}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{space.name}</span>
                                <p className="text-sm text-gray-600">{space.description}</p>
                                <p className="text-xs text-gray-500">
                                  Minimum area: {space.minArea} {space.unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSpaceId(space.id)
                                    setEditingSpaceData({
                                      basePrice: space.basePrice,
                                      pricePerSqm: space.pricePerSqm,
                                    })
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
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
                    <CardTitle className="flex items-center justify-between">
                      <span>Layout Plan</span>
                      <Button variant="destructive" size="sm" onClick={handleDeleteLayout}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </CardTitle>
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
                    <CardTitle className="flex items-center justify-between">
                      <span>Brochure</span>
                      <Button variant="destructive" size="sm" onClick={handleDeleteBrochure}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </CardTitle>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Speakers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.speakerSessions?.length > 0 ? (
                      event.speakerSessions.map((session: any) => (
                        <div
                          key={session.id}
                          className="flex justify-between items-start p-4 bg-white rounded-lg border shadow-sm"
                        >
                          <div className="flex gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={session.speaker?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{session.speaker?.firstName?.charAt(0) || "S"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{session.speaker?.firstName || "Speaker"}</h4>
                              <p className="text-sm text-gray-600">{session.title}</p>
                              <p className="text-xs text-gray-500">{session.description}</p>
                            </div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSpeaker(session.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No speakers scheduled yet.</p>
                    )}
                  </CardContent>
                </Card>
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
