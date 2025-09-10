"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Share2, MapPin, Calendar, Heart, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"

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
}

interface ApiResponse {
  events: Event[]
}

export default function EventsPageContent() {
  const [activeTab, setActiveTab] = useState("All Events")
  const [selectedFormat, setSelectedFormat] = useState("All Formats")
  const [selectedLocation, setSelectedLocation] = useState("")
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "")

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("Trending")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [rating, setRating] = useState("")

  // New sidebar state
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [formatOpen, setFormatOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [relatedTopicOpen, setRelatedTopicOpen] = useState(true)
  const [entryFeeOpen, setEntryFeeOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRelatedTopics, setSelectedRelatedTopics] = useState<string[]>([])

  // Auto-scroll state for featured events
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const router = useRouter()

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

      const transformedEvents = data.events.map((event) => ({
        ...event,
        timings: {
          startDate: event.startDate,
          endDate: event.endDate,
        },
        location: {
          city: event.venue?.venueCity || event.location?.city || "Unknown City",
          venue: event.location?.venue || "Unknown Venue",
          country: event.venue?.venueCountry || event.location?.country,
        },
        featured: event.tags?.includes("featured") || false,
        categories: event.categories || [],
        tags: event.tags || [],
        images: event.images || [{ url: "/placeholder.svg?height=200&width=300" }],
        pricing: event.pricing || { general: 0 },
        rating: event.rating || { average: 4.5 },
      }))

      setEvents(transformedEvents)
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
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
    // Add location parameter handling
    const locationFromUrl = searchParams.get("location")
    if (locationFromUrl) {
      setSelectedLocation(locationFromUrl)
    }
    // Add country parameter handling
    const countryFromUrl = searchParams.get("country")
    if (countryFromUrl) {
      setSelectedLocation(countryFromUrl) // Use same location filter for countries
    }
    // Add venue parameter handling
    const venueFromUrl = searchParams.get("venue")
    if (venueFromUrl) {
      setSelectedLocation(venueFromUrl) // Use same location filter for venues
    }
  }, [categoryFromUrl, searchParams])

  const itemsPerPage = 6

  // Get unique categories, locations, and other filter options from data
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

  const locations = useMemo(() => {
    if (!events || events.length === 0) return []

    const locationMap = new Map()
    events.forEach((event) => {
      if (event.venue?.venueCity) {
        const city = event.venue.venueCity
        locationMap.set(city, (locationMap.get(city) || 0) + 1)
      }
      if (event.venue?.venueCountry) {
        const country = event.venue.venueCountry
        locationMap.set(country, (locationMap.get(country) || 0) + 1)
      }
      if (event.location?.city) {
        const city = event.location.city
        locationMap.set(city, (locationMap.get(city) || 0) + 1)
      }
    })
    return Array.from(locationMap.entries()).map(([name, count]) => ({ name, count }))
  }, [events])

  // Enhanced categories with search functionality
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.name.toLowerCase().includes(categorySearch.toLowerCase()))
  }, [categories, categorySearch])

  // Related topics (using same data as categories for demo)
  const relatedTopics = useMemo(() => {
    return categories.map((cat) => ({ ...cat, name: `${cat.name} Related` }))
  }, [categories])

  // Helper function to check if event is in date range
  const isEventInDateRange = (event: any, dateRange: string) => {
    const eventDate = new Date(event.timings.startDate)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

    switch (dateRange) {
      case "today":
        return eventDate >= today && eventDate < tomorrow
      case "tomorrow":
        return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      case "this-week":
        return eventDate >= today && eventDate <= weekFromNow
      case "this-month":
        return eventDate >= today && eventDate <= monthFromNow
      case "next-month":
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        const monthAfter = new Date(today.getFullYear(), today.getMonth() + 2, 1)
        return eventDate >= nextMonth && eventDate < monthAfter
      default:
        return true
    }
  }

  // Helper function to check if event matches tab filter
  const isEventInTab = (event: any, tab: string) => {
    const eventDate = new Date(event.timings.startDate)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

    switch (tab) {
      case "All Events":
        return true
      case "Upcoming":
        // Show all future events, not just those with "upcoming" status
        return eventDate >= today
      case "This Week":
        return eventDate >= today && eventDate <= weekFromNow
      case "This Month":
        return eventDate >= today && eventDate <= monthFromNow
      default:
        return true
    }
  }

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    let filtered = events

    console.log("[v0] Starting with events:", events.length)
    console.log("[v0] Active tab:", activeTab)
    console.log("[v0] Selected categories:", selectedCategories)

    // Tab filter
    filtered = filtered.filter((event) => isEventInTab(event, activeTab))
    console.log("[v0] After tab filter:", filtered.length)

    // Search filter - enhanced
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          event.categories.some((cat) => cat.toLowerCase().includes(query)) ||
          event.venue?.venueCity?.toLowerCase().includes(query) ||
          event.venue?.venueCountry?.toLowerCase().includes(query) ||
          event.location?.city?.toLowerCase().includes(query),
      )
      console.log("[v0] After search filter:", filtered.length)
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) =>
          selectedCategories.some(
            (selectedCat) =>
              cat.toLowerCase().includes(selectedCat.toLowerCase()) ||
              selectedCat.toLowerCase().includes(cat.toLowerCase()),
          ),
        ),
      )
      console.log("[v0] After category filter:", filtered.length)
    } else if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase())),
      )
      console.log("[v0] After single category filter:", filtered.length)
    }

    // Related topics filter
    if (selectedRelatedTopics.length > 0) {
      const relatedCats = selectedRelatedTopics.map((topic) => topic.replace(" Related", ""))
      filtered = filtered.filter((event) => event.categories.some((cat) => relatedCats.includes(cat)))
    }

    // Location filter (works for cities, countries, and venues)
    if (selectedLocation) {
      filtered = filtered.filter(
        (event) =>
          event.venue?.venueCity?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          event.venue?.venueCountry?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          event.location?.city?.toLowerCase().includes(selectedLocation.toLowerCase()),
      )
    }

    // Format filter
    if (selectedFormat && selectedFormat !== "All Formats") {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => cat.toLowerCase().includes(selectedFormat.toLowerCase())),
      )
    }

    // Date range filter
    if (selectedDateRange) {
      filtered = filtered.filter((event) => isEventInDateRange(event, selectedDateRange))
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter((event) => {
        const price = event.pricing.general
        switch (priceRange) {
          case "free":
            return price === 0
          case "under-1000":
            return price < 1000
          case "1000-5000":
            return price >= 1000 && price <= 5000
          case "above-5000":
            return price > 5000
          default:
            return true
        }
      })
    }

    // Rating filter
    if (rating) {
      const minRating = Number.parseFloat(rating)
      filtered = filtered.filter((event) => event.rating.average >= minRating)
    }

    // Sort based on view mode
    if (viewMode === "Trending") {
      // filtered.sort((a, b) => b.followers - a.followers)
    } else if (viewMode === "Date") {
      filtered.sort((a, b) => new Date(a.timings.startDate).getTime() - new Date(b.timings.startDate).getTime())
    }

    return filtered
  }, [
    events,
    activeTab,
    searchQuery,
    selectedCategory,
    selectedCategories,
    selectedRelatedTopics,
    selectedLocation,
    selectedFormat,
    selectedDateRange,
    priceRange,
    rating,
    viewMode,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Featured events (events with featured flag)
  const featuredEvents = events.filter((event) => event.featured)

  // Auto-scroll effect for featured events
  useEffect(() => {
    if (featuredEvents.length === 0 || isHovered || isTransitioning) return

    const totalSlides = Math.ceil(featuredEvents.length / 3)
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [featuredEvents.length, isHovered, isTransitioning])

  // Handle transition end
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // Match the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const tabs = ["All Events", "Upcoming", "This Week", "This Month"]

  const handleCategoryToggle = (categoryName: string) => {
    console.log("[v0] Toggling category:", categoryName)
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
      console.log("[v0] New selected categories:", newCategories)
      return newCategories
    })
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleRelatedTopicToggle = (topicName: string) => {
    setSelectedRelatedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName],
    )
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedCategories([])
    setSelectedRelatedTopics([])
    setSelectedLocation("")
    setPriceRange("")
    setRating("")
    setSelectedFormat("All Formats")
    setSelectedDateRange("")
    setActiveTab("All Events")
    setCurrentPage(1)

    // Navigate to clean /event URL
    router.push("/event")
  }

  // Navigation functions for featured events
  const goToPrevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const totalSlides = Math.ceil(featuredEvents.length / 3)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const totalSlides = Math.ceil(featuredEvents.length / 3)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    activeTab,
    searchQuery,
    selectedCategory,
    selectedCategories,
    selectedRelatedTopics,
    selectedLocation,
    selectedFormat,
    selectedDateRange,
    priceRange,
    rating,
  ])

  const isEventPostponed = (eventId: string) => {
    // Replace with actual logic to check if event is postponed
    return false
  }

  const getOriginalEventDates = (eventId: string) => {
    // Replace with actual logic to fetch original event dates
    return {
      startDate: null,
      endDate: null,
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">All Events</h1>
            <p className="text-gray-600">Discover amazing events happening around you</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Follow</Button>
            <Button variant="outline" className="px-4 py-2 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div className="w-80 sticky top-6 self-start">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-0">
                {/* Calendar Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Calendar</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Format Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setFormatOpen(!formatOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Format</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${formatOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Location Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setLocationOpen(!locationOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Location</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${locationOpen ? "rotate-180" : ""}`}
                    />
                  </button>
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
                          placeholder="Search for Topics"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="text-sm pr-8 border-gray-200"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <div className="space-y-3">
                        {[
                          "Expo",
                          "Business Event",
                          "Food & Beverage",
                          "Finance",
                          "Technology",
                          "Conference",
                          "Workshop",
                          "Networking",
                        ].map((category) => {
                          const count = events.filter((event) =>
                            event.categories.some(
                              (cat) =>
                                cat.toLowerCase().includes(category.toLowerCase()) ||
                                category.toLowerCase().includes(cat.toLowerCase()),
                            ),
                          ).length

                          return (
                            <div key={category} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category)}
                                  onChange={() => handleCategoryToggle(category)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{category}</span>
                              </div>
                              <span className="text-xs text-gray-500">{count > 0 ? `${count}` : "0.0k"}</span>
                            </div>
                          )
                        })}
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-3 text-sm text-gray-600">
                        View All
                      </Button>
                    </div>
                  )}
                </div>

                {/* Related Topic Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setRelatedTopicOpen(!relatedTopicOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Related Topic</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${relatedTopicOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {relatedTopicOpen && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3">
                        {["Expo", "Business Event", "Food & Beverage", "Finance", "Technology"].map((topic) => (
                          <div key={topic} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{topic}</span>
                            </div>
                            <span className="text-xs text-gray-500">0.0k</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-3 text-sm text-gray-600">
                        View All
                      </Button>
                    </div>
                  )}
                </div>

                {/* Entry Fee Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setEntryFeeOpen(!entryFeeOpen)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-gray-900 font-medium">Entry Fee</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${entryFeeOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-red-500 font-medium mb-1">Top 100 Events</h3>
                  <p className="text-sm text-gray-500">Discover and track top events</p>
                </div>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-red-500 font-medium mb-1">Social Events</h3>
                  <p className="text-sm text-gray-500">Discover and track top events</p>
                </div>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-red-500 font-medium mb-1">Search by Company</h3>
                  <p className="text-sm text-gray-500">Discover and track top events</p>
                </div>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-red-500 font-medium mb-1">Explore Speaker</h3>
                  <p className="text-sm text-gray-500">Discover and track top events</p>
                </div>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-red-500 font-medium mb-1">Filter</h3>
                  <p className="text-sm text-gray-500">Discover and track top events</p>
                </div>
                <div className="p-4">
                  <h3 className="text-blue-600 font-medium">All Events</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-6">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {paginatedEvents.length} of {filteredEvents.length} events
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("Trending")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      viewMode === "Trending" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Trending 🔥
                  </button>
                  <button
                    onClick={() => setViewMode("Date")}
                    className={`px-3 py-1 text-sm rounded-full ${
                      viewMode === "Date" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Date
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
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
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

            <div className="space-y-4">
              {paginatedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No events found matching your criteria</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearAllFilters}>
                    Clear All Filters
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
                            src={getEventImage(event) || "/placeholder.svg"}
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
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                              <div className="flex items-center text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>
                                  {formatDate(event.timings.startDate)} - {formatDate(event.timings.endDate)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>
                                  {event.location?.city || "Location TBD"}, {event.location?.venue || "Venue TBD"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                              <div className="flex items-center space-x-2">
                                {event.categories.slice(0, 2).map((category, idx) => (
                                  <Badge
                                    key={idx}
                                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-3 py-1"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Actions and Rating */}
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="p-2">
                                  <Heart className="w-4 h-4 text-gray-400" />
                                </Button>
                                <Button variant="ghost" size="sm" className="p-2">
                                  <Share2 className="w-4 h-4 text-gray-400" />
                                </Button>
                              </div>
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                                {event.rating?.average || "4.5"}
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

            {featuredEvents.length > 0 && (
              <section className="py-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 underline">Featured Events</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevSlide}
                      className="p-2 bg-transparent"
                      disabled={isTransitioning}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextSlide}
                      className="p-2 bg-transparent"
                      disabled={isTransitioning}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {featuredEvents.slice(0, 3).map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white">
                      <div className="relative">
                        <Image
                          src={getEventImage(event) || "/placeholder.svg"}
                          alt={event.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured ✨
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location?.city || "Location TBD"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(event.timings.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-600 text-white text-xs">{event.categories[0]}</Badge>
                          <span className="text-sm font-bold text-green-600">{event.rating?.average || "4.6"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-4 space-x-1">
                  {[0, 1, 2, 3].map((dot) => (
                    <div key={dot} className={`w-2 h-2 rounded-full ${dot === 1 ? "bg-blue-600" : "bg-gray-300"}`} />
                  ))}
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">2 of 4</span>
                </div>
              </section>
            )}
          </div>

          <div className="w-80 space-y-6">
            {/* Large Featured Event */}
            {featuredEvents[0] && (
              <Card className="bg-white shadow-lg">
                <div className="relative">
                  <Image
                    src={getEventImage(featuredEvents[0]) || "/placeholder.svg"}
                    alt={featuredEvents[0].title}
                    width={320}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <Badge className="bg-blue-600 text-white text-xs">Expo</Badge>
                    <Badge className="bg-blue-600 text-white text-xs">Business Event</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    4.5
                  </div>
                </div>
              </Card>
            )}

            {/* Upcoming Events List */}
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <Card key={event.id} className="bg-white border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Image
                        src={getEventImage(event) || "/placeholder.svg"}
                        alt={event.title}
                        width={60}
                        height={60}
                        className="w-15 h-15 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{formatDate(event.timings.startDate)}</p>
                        <p className="text-xs text-gray-600 mb-2">{event.location?.city || "Location TBD"}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-600 text-white text-xs">{event.categories[0]}</Badge>
                          <div className="w-4 h-4 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
