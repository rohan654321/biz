"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"  
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Share2, MapPin, Calendar, Heart, ChevronDown, ChevronLeft, ChevronRight, Loader2, Edit, Trash2, Save, X, Image as ImageIcon, Users, Tag, Clock, Filter } from "lucide-react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  categories: string[]
  tags: string[]
  images: { url: string }[]
  location: {
    city: string
    venue: string
    country?: string
  }
  venue?: {
    venueCity?: string
    venueCountry?: string
  }
  pricing: {
    general: number
  }
  rating: {
    average: number
  }
  featured?: boolean
  status: string
  timings: {
    startDate: string
    endDate: string
  }
  capacity?: number
  organizer?: string
}

interface ApiResponse {
  events: Event[]
}

// Helper function to normalize event data
const normalizeEvent = (event: any): Event => ({
  id: event.id || "",
  title: event.title || "",
  description: event.description || "",
  startDate: event.startDate || new Date().toISOString(),
  endDate: event.endDate || new Date().toISOString(),
  categories: event.categories || [],
  tags: event.tags || [],
  images: event.images || [],
  location: event.location || { city: "", venue: "", country: "" },
  venue: event.venue || {},
  pricing: event.pricing || { general: 0 },
  rating: event.rating || { average: 0 },
  featured: event.featured || false,
  status: event.status || "draft",
  timings: event.timings || { 
    startDate: event.startDate || new Date().toISOString(), 
    endDate: event.endDate || new Date().toISOString() 
  },
  capacity: event.capacity || 0,
  organizer: event.organizer || ""
})

export default function EditEventComponent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("All")

  // Sidebar state
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [statusOpen, setStatusOpen] = useState(true)
  const [featuredOpen, setFeaturedOpen] = useState(true)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedFeatured, setSelectedFeatured] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const eventIdFromUrl = searchParams.get("id")

  const DEFAULT_EVENT_IMAGE = "/herosection-images/weld.jpg?height=160&width=200&text=Event"

  const getEventImage = (event: any) => {
    return event.images?.[0]?.url || event.image || DEFAULT_EVENT_IMAGE
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/events")

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data: ApiResponse = await response.json()
      
      // Validate and normalize event data
      const validatedEvents = data.events.map(event => normalizeEvent(event))
      
      setEvents(validatedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (eventIdFromUrl && events.length > 0) {
      const event = events.find(e => e.id === eventIdFromUrl)
      if (event) {
        setEditingEvent(normalizeEvent(event))
        setIsEditing(true)
      }
    }
  }, [eventIdFromUrl, events])

  const handleEdit = (event: Event) => {
    setEditingEvent(normalizeEvent(event))
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!editingEvent) return

    try {
      setSaving(true)
      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingEvent),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      // Update local state
      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ))

      setIsEditing(false)
      setEditingEvent(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      setEvents(events.filter(event => event.id !== eventId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event")
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!editingEvent) return

    setEditingEvent(prev => prev ? {
      ...prev,
      [field]: value
    } : null)
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    if (!editingEvent) return;
    
    setEditingEvent(prev => ({
      ...prev!,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: value
      }
    }));
  }

  const handleCategoryChange = (index: number, value: string) => {
    if (!editingEvent) return

    const newCategories = [...(editingEvent.categories || [])]
    newCategories[index] = value
    setEditingEvent(prev => prev ? { ...prev, categories: newCategories } : null)
  }

  const addCategory = () => {
    if (!editingEvent) return
    setEditingEvent(prev => prev ? { 
      ...prev, 
      categories: [...(prev.categories || []), ""] 
    } : null)
  }

  const removeCategory = (index: number) => {
    if (!editingEvent) return
    const newCategories = (editingEvent.categories || []).filter((_, i) => i !== index)
    setEditingEvent(prev => prev ? { ...prev, categories: newCategories } : null)
  }

  // Filter events based on search and sidebar filters
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.categories || []).some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event =>
        event.categories.some(cat =>
          selectedCategories.some(
            selectedCat => cat.toLowerCase().trim() === selectedCat.toLowerCase().trim()
          )
        )
      )
    }

    // Status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter(event => selectedStatus.includes(event.status))
    }

    // Featured filter
    if (selectedFeatured.length > 0) {
      if (selectedFeatured.includes("featured")) {
        filtered = filtered.filter(event => event.featured)
      }
      if (selectedFeatured.includes("regular")) {
        filtered = filtered.filter(event => !event.featured)
      }
    }

    return filtered
  }, [events, searchQuery, selectedCategories, selectedStatus, selectedFeatured])

  // Get unique categories for sidebar
  const categories = useMemo(() => {
    if (!events || events.length === 0) return []
    const categoryMap = new Map()
    events.forEach((event) => {
      if (event.categories && Array.isArray(event.categories)) {
        event.categories.forEach((cat) => {
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
        })
      }
    })
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
  }, [events])

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.name.toLowerCase().includes(categorySearch.toLowerCase()))
  }, [categories, categorySearch])

  // Pagination
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
      return newCategories
    })
    setCurrentPage(1)
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatus((prev) => {
      const newStatus = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
      return newStatus
    })
    setCurrentPage(1)
  }

  const handleFeaturedToggle = (type: string) => {
    setSelectedFeatured((prev) => {
      const newFeatured = prev.includes(type)
        ? prev.filter((f) => f !== type)
        : [...prev, type]
      return newFeatured
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedStatus([])
    setSelectedFeatured([])
    setCategorySearch("")
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={fetchEvents} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditing ? "Edit Event" : "Manage Events"}
            </h1>
            <p className="text-gray-600">
              {isEditing ? "Update event details" : "View and manage all events"}
            </p>
          </div>
          {/* <div className="flex items-center space-x-4">
            {!isEditing && (
            //   <Button 
            //     className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            //     onClick={() => router.push("/events/create")}
            //   >
            //     Create New Event
            //   </Button>
            )}
          </div> */}
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 sticky top-6 self-start">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-0">
                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Category</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {categoryOpen && (
                    <div className="px-4 pb-4">
                      <div className="relative mb-3">
                        <Input
                          type="text"
                          placeholder="Search categories..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="text-sm pr-8 border-gray-200"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleCategoryToggle(category.name)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{category.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{category.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setStatusOpen(!statusOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Status</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {statusOpen && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3">
                        {["draft", "published", "cancelled", "completed"].map((status) => (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedStatus.includes(status)}
                                onChange={() => handleStatusToggle(status)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">{status}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {events.filter(e => e.status === status).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setFeaturedOpen(!featuredOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Featured</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${featuredOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {featuredOpen && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3">
                        {["featured", "regular"].map((type) => (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFeatured.includes(type)}
                                onChange={() => handleFeaturedToggle(type)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">{type}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {type === "featured" 
                                ? events.filter(e => e.featured).length
                                : events.filter(e => !e.featured).length
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                <div className="p-4">
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isEditing && editingEvent ? (
              /* Edit Form - Same Page */
              <Card className="bg-white shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Editing: {editingEvent.title}</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <Edit className="w-5 h-5 mr-2" />
                          Basic Information
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                          <Input
                            value={editingEvent.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Enter event title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingEvent.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter event description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <Input
                              type="datetime-local"
                              value={editingEvent.startDate.split('T')[0]}
                              onChange={(e) => handleInputChange("startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <Input
                              type="datetime-local"
                              value={editingEvent.endDate.split('T')[0]}
                              onChange={(e) => handleInputChange("endDate", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          Location
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <Input
                            value={editingEvent.location?.city || ""}
                            onChange={(e) => handleNestedInputChange("location", "city", e.target.value)}
                            placeholder="Enter city"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                          <Input
                            value={editingEvent.location?.venue || ""}
                            onChange={(e) => handleNestedInputChange("location", "venue", e.target.value)}
                            placeholder="Enter venue name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Categories */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium flex items-center">
                            <Tag className="w-5 h-5 mr-2" />
                            Categories
                          </h3>
                          <Button variant="outline" size="sm" onClick={addCategory}>
                            Add Category
                          </Button>
                        </div>
                        
                        {(editingEvent.categories || []).map((category, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input
                              value={category}
                              onChange={(e) => handleCategoryChange(index, e.target.value)}
                              placeholder="Enter category"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCategory(index)}
                              disabled={(editingEvent.categories || []).length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Pricing & Status */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Pricing & Status
                        </h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">General Price ($)</label>
                          <Input
                            type="number"
                            value={editingEvent.pricing?.general ?? 0}
                            onChange={(e) => handleNestedInputChange("pricing", "general", Number(e.target.value))}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={editingEvent.status}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={editingEvent.featured || false}
                            onChange={(e) => handleInputChange("featured", e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                            Featured Event
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Events List View */
              <>
                {/* View Toggle and Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Showing {paginatedEvents.length} of {filteredEvents.length} events
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode("All")}
                        className={`px-3 py-1 text-sm rounded-full ${
                          viewMode === "All" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        All Events
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="text-gray-600"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="text-gray-600"
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Events Grid */}
                <div className="space-y-4">
                  {paginatedEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No events found</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => router.push("/events/create")}
                      >
                        Create Your First Event
                      </Button>
                    </div>
                  ) : (
                    paginatedEvents.map((event) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow bg-white border border-gray-100">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Event Image */}
                            <div className="flex-shrink-0">
                              <Image
                                src={getEventImage(event)}
                                alt={event.title}
                                width={200}
                                height={140}
                                className="w-48 h-32 object-cover rounded-lg"
                              />
                            </div>

                            {/* Event Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                    <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                                      {event.status}
                                    </Badge>
                                    {event.featured && (
                                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(event.startDate)}</span>
                                  </div>
                                  
                                  <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{event.location?.city || "TBD"}, {event.location?.venue || "TBD"}</span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                  
                                  <div className="flex items-center space-x-2">
                                    {(event.categories || []).slice(0, 2).map((category, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEdit(event)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDelete(event.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>${event.pricing?.general || 0}</span>
                                    <span>•</span>
                                    <span>{event.rating?.average || "N/A"} ⭐</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}