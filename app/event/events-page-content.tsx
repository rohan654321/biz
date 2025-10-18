"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  CalendarDays,
  UserPlus,
} from "lucide-react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import AdCard from "@/components/add-card"
import { BookmarkButton } from "@/components/bookmark-button"
import { useToast } from "@/hooks/use-toast"
import { ShareButton } from "@/components/share-button"
import { useSession } from "next-auth/react"

interface Event {
  image: string
  organizer: any
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  categories: string[]
  tags: string[]
  images: { url: string }[]
  location: {
    address: string
    city: string
    venue: string
    country?: string
  }
  venue?: {
    venueAddress?: string
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
    [x: string]: string
    startDate: string
    endDate: string
  }
  averageRating?: number
  totalReviews?: number
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

  const [visitorCounts, setVisitorCounts] = useState<Record<string, number>>({})
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("visitorCounts") : null
      if (raw) setVisitorCounts(JSON.parse(raw))
    } catch (e) {
      console.log("[v0] Failed to load visitorCounts:", e)
    }
  }, [])

  const persistVisitorCounts = (next: Record<string, number>) => {
    setVisitorCounts(next)
    try {
      localStorage.setItem("visitorCounts", JSON.stringify(next))
    } catch (e) {
      console.log("[v0] Failed to persist visitorCounts:", e)
    }
  }

  const incrementVisitorCount = (eventId: string) => {
    if (!eventId) return
    const next = { ...visitorCounts, [eventId]: (visitorCounts[eventId] || 0) + 1 }
    persistVisitorCounts(next)
  }

  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const DEFAULT_EVENT_IMAGE = "/city/c4.jpg"

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

      const transformedEvents = data.events.map((event: any) => {
        // Safely resolve an id for downstream actions
        const resolvedId =
          event.id ||
          event._id ||
          (typeof event._id === "object" && event._id.$oid) ||
          (typeof event._id === "string" ? event._id : undefined)

        const avg =
          typeof event?.averageRating === "number" && event.averageRating > 0
            ? event.averageRating
            : typeof event?.rating?.average === "number"
              ? event.rating.average
              : 4.5

        return {
          ...event,
          // ensure we always have a usable string id
          id: String(resolvedId || ""),
          timings: {
            startDate: event.startDate,
            endDate: event.endDate,
          },
          location: {
            address: event.venue?.venueAddress || "Not Added"
            // city: event.venue?.venueCity || event.location?.city || "Unknown City",
            // venue: event.location?.venue || "Unknown Venue",
            // country: event.venue?.venueCountry || event.location?.country,
          },
          featured: event.tags?.includes("featured") || false,
          categories: event.categories || [],
          tags: event.tags || [],
          images: event.images || [{ url: "/images/gpex.jpg?height=200&width=300" }],
          pricing: event.pricing || { general: 0 },
          rating: { average: avg },
          // keep totals if backend returns them
          totalReviews: typeof event?.totalReviews === "number" ? event.totalReviews : undefined,
        }
      })

      setEvents(transformedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error fetching events:", err)
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
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
    const locationFromUrl = searchParams.get("location")
    if (locationFromUrl) {
      setSelectedLocation(locationFromUrl)
    }
    const countryFromUrl = searchParams.get("country")
    if (countryFromUrl) {
      setSelectedLocation(countryFromUrl)
    }
    const venueFromUrl = searchParams.get("venue")
    if (venueFromUrl) {
      setSelectedLocation(venueFromUrl)
    }
  }, [categoryFromUrl, searchParams])

  const handleVisitClick = async (eventId: string, eventTitle: string) => {
    console.log("[v0] handleVisitClick called with:", { eventId, eventTitle, hasSession: !!session, session })
    if (!eventId) {
      toast({
        title: "Invalid event",
        description: "We could not identify this event. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    // Increment immediately on click to reflect in UI, even if backend call happens next
    incrementVisitorCount(eventId)

    if (!session) {
      try {
        alert(`Authentication Required\nPlease log in to visit "${eventTitle}".`)
      } catch {
        toast({
          title: "Authentication required",
          description: "Please log in to continue.",
          variant: "destructive",
        })
      }
      router.push("/login")
      return
    }

    const userId = (session as any)?.user?.id
    if (!userId) {
      toast({
        title: "Session issue",
        description: "Your session is missing an ID. Please log out and log back in.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "attendee", userId, eventId }),
      })

      if (response.ok) {
        // Success alert for authenticated users
        try {
          alert(`Thanks for visiting "${eventTitle}"!`)
        } catch {
          // fallback toast if alert suppressed
          toast({
            title: "Visit recorded",
            description: `Thanks for visiting "${eventTitle}".`,
          })
        }
      } else {
        const problemText = await response.text().catch(() => "")
        console.error("[v0] Visit lead failed:", response.status, problemText)
        toast({
          title: "Error",
          description: "Failed to record your interest. Your local visit counter was still updated.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Visit lead error:", error)
      toast({
        title: "Error",
        description: "Failed to record your interest. Your local visit counter was still updated.",
        variant: "destructive",
      })
    }
  }

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
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    switch (tab) {
      case "All Events":
        return true
      case "Upcoming":
        return eventDate >= today
      case "Past":
        return eventDate < today
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

    // Tab filter
    filtered = filtered.filter((event) => isEventInTab(event, activeTab))

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
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) =>
          selectedCategories.some((selectedCat) => cat.toLowerCase().trim() === selectedCat.toLowerCase().trim()),
        ),
      )
    } else if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim()),
      )
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
      // Sort by rating or popularity
      filtered.sort((a, b) => b.rating.average - a.rating.average)
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

  // Dynamic banner title based on filters
  const getBannerTitle = () => {
    if (selectedCategories.length > 0) {
      return `${selectedCategories.join(", ")} Events`
    }
    if (selectedCategory) {
      return `${selectedCategory} Events`
    }
    if (selectedLocation) {
      return `Events in ${selectedLocation}`
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }
    if (activeTab !== "All Events") {
      return `${activeTab} Events`
    }
    return "All Events" // Default title
  }

  const getFollowerCount = () => {
    // Sum visitor counts across filtered events
    const total = filteredEvents.reduce((sum, ev) => sum + (visitorCounts[ev.id] || 0), 0)
    if (total >= 1000) return `${Math.round(total / 1000)}K+ Followers`
    return `${total} Followers`
  }

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
    }, 3000)

    return () => clearInterval(interval)
  }, [featuredEvents.length, isHovered, isTransitioning])

  // Handle transition end
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
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

  const tabs = ["All Events", "Upcoming", "Past", "This Week", "This Month"]

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
      return newCategories
    })
    setCurrentPage(1)
  }

  const handleRelatedTopicToggle = (topicName: string) => {
    setSelectedRelatedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName],
    )
    setCurrentPage(1)
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full px-4 py-6">
          {/* Dynamic Banner Section */}
          <div
            className="flex items-center justify-between mb-6 p-6 border border-blue-200 bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{
              backgroundImage: "url('/city/c2.jpg')",
            }}
          >
            {/* Softer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-blue-50/30 to-purple-50/40"></div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getBannerTitle()}</h1>
              <p className="text-gray-700 text-lg">{getFollowerCount()}</p>
            </div>

            <div className="relative z-10 flex items-center space-x-4">{/* Buttons / avatars */}</div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Sidebar - Fixed width */}
            <div className="w-full lg:w-80 lg:sticky lg:top-6 self-start flex-shrink-0">
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
                    <h3 className="text-red-500 font-medium mb-1">Explore Speaker</h3>
                    <p className="text-sm text-gray-500">Discover and track top events</p>
                  </div>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-blue-600 font-medium">All Events</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Reduced width */}
            <div className="flex-1 w-full max-w-3xl min-w-0 space-y-6">
              {/* View Toggle and Results Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {paginatedEvents.length} of {filteredEvents.length} events
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("Trending")}
                      className={`px-3 py-1 text-sm rounded-full ${viewMode === "Trending" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      Trending 🔥
                    </button>
                    <button
                      onClick={() => setViewMode("Date")}
                      className={`px-3 py-1 text-sm rounded-full ${viewMode === "Date" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"
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
                        className={`w-8 h-8 rounded text-sm font-medium ${currentPage === page
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
                    <Link href={`/event/${event.id}`} key={event.id} className="block">
                      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all w-full">
                        <CardContent className="p-0 flex">
                          {/* Left Image Section - Significantly reduced size */}
                          <div className="relative w-[80px] h-[100px] sm:w-[100px] sm:h-[120px] md:w-[120px] md:h-[140px] lg:w-[140px] lg:h-[160px] flex-shrink-0">
                            <Image
                              src={event.image || "/images/gpex.jpg"}
                              alt={event.title}
                              fill
                              className="object-cover m-2 rounded-sm"
                            />
                          </div>

                          {/* Right Section */}
                          <div className="flex-1 flex flex-col px-10 py-1 min-w-0">
                            {/* Top Section */}
                            <div className="min-w-0">
                              {/* Title & Edition */}
                              <div className="flex items-start justify-between min-w-0">
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 truncate">{event.title}</h3>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="text-xs font-medium truncate">
                                      {event.location?.address || "Address not comming"}
                                      {/* {event.location?.venue || "Unknown Venue"},{" "} */}
                                      {/* {event.location?.city || "Unknown City"} */}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="text-xs font-medium">
                                      {event.timings?.formatted || "Mon, 27 - Wed, 29 Oct 2025"}
                                    </span>
                                  </div>
                                  <div className="flex items-center flex-wrap gap-3 p-2">
                                    <div className="">
                                      <Badge className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                        Paid entry
                                      </Badge>
                                    </div>

                                    <div className="flex gap-3">
                                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-semibold">

                                        <Star className="w-3 h-3 fill-current" />
                                        {/* small guard for rating display to avoid runtime errors */}
                                        <span>
                                          {Number.isFinite(event.rating?.average) ? event.rating.average.toFixed(1) : "4.5"}
                                        </span>
                                        {event.totalReviews && event.totalReviews > 0 && (
                                          <span className="text-xs text-gray-500 ml-1">({event.totalReviews})</span>
                                        )}
                                      </div>
                                      <div className="flex items-center text-gray-600 text-xs gap-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-3 h-3 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-9a4 4 0 100 8 4 4 0 000-8z"
                                          />
                                        </svg>
                                        {visitorCounts[event.id] || 0} Followers
                                      </div>

                                    </div>
                                  </div>
                                </div>

                                {/* Right Column: Edition + Rating + Followers + Paid Entry + Visit Button */}
                                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                                  {/* Verified + Edition */}
                                  <div className="flex items-center gap-1">
                                    {/* Verified Image */}
                                    <div className="w-5 h-5">
                                      <img
                                        src="/images/VerifiedBadge.png"
                                        alt="Verified"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <span className="text-gray-600 font-medium text-xs">2nd Edition</span>
                                  </div>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {event.categories?.slice(0, 2).map((category: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 mt-3" />

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              {/* Organizer */}


                              <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700 flex-shrink-0 text-xs">
                                  {typeof event.organizer === "string"
                                    ? event.organizer.charAt(0)
                                    : event.organizer?.name?.charAt(0) || "M"}
                                </div>
                                <span className="truncate">
                                  {typeof event.organizer === "string"
                                    ? event.organizer
                                    : event.organizer?.name || "Maxx Business Media Pvt Ltd"}
                                </span>
                              </div>

                              {/* Share + Save + Visit Buttons */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <ShareButton id={event.id} title={event.title} type="event" />                                
                                <Button
                                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 mt-1 rounded-md text-sm shadow-sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleVisitClick(event.id, event.title)
                                  }}
                                >
                                    <BookmarkButton
                                  eventId={event.id}
                                  className="p-1 rounded-full text-white transition"
                                />
                                  Save
                                </Button>
                              </div>
                            </div>

                          </div>
                        </CardContent>
                      </div>
                    </Link>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredEvents.slice(0, 3).map((event) => (
                      <Card key={event.id} className="hover:shadow-lg transition-shadow bg-white">
                        <div className="relative">
                          <Image
                            src={getEventImage(event) || "/placeholder.svg"}
                            alt={event.title}
                            width={400}
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{event.title}</h3>
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
                            {/* small guard for rating display to avoid runtime errors */}
                            <span className="text-sm font-bold text-green-600">
                              {Number.isFinite(event.rating?.average) ? event.rating.average.toFixed(1) : "4.5"}
                            </span>
                          </div>
                          <button
                            className="w-full  bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleVisitClick(event.id, event.title)
                            }}
                          >
                            Visit
                          </button>
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

            {/* Right Column - Fixed width */}
            <div className="w-full lg:w-80 space-y-6 self-start flex-shrink-0">
              {/* Advertisement */}
              <AdCard />

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
                      {/* small guard for rating display to avoid runtime errors */}
                      {Number.isFinite(featuredEvents[0].rating?.average)
                        ? featuredEvents[0].rating.average.toFixed(1)
                        : "4.5"}
                    </div>
                  </div>
                  <CardContent className="">
                    {/* ensure every Visit button prevents navigation before calling handler */}
                    <button
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white rounded-md text-sm shadow-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleVisitClick(featuredEvents[0].id, featuredEvents[0].title)
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Visit
                    </button>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Events (Styled Like FeaturedEvents) */}
              <div className="space-y-5">
                {events.slice(0, 3).map((event) => (
                  <Link key={event.id} href={`/event/${event.id}`} className="group block">
                    <div
                      className="bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl 
                     p-4 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 
                     transition-all duration-300"
                    >
                      {/* Top Section */}
                      <div className="flex items-start gap-3">
                        {/* Image */}
                        <div className="w-[90px] h-[80px] flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={getEventImage(event) || "/placeholder.svg"}
                            alt={event.title}
                            width={90}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col text-left">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{event.title}</h3>
                          <p className="text-xs text-gray-700 mb-1">International Exhibition</p>

                          <div className="flex items-center text-xs font-semibold text-gray-800">
                            <CalendarDays className="w-3 h-3 mr-1 text-gray-700" />
                            {new Date(event.timings.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>

                          <div className="flex items-center text-xs text-gray-700 mt-1">
                            <MapPin className="w-3 h-3 mr-1 text-blue-700" />
                            {event.location?.city || "Chennai, India"}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-300"></div>

                      {/* Categories */}
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className="px-2 py-1 text-xs rounded-full border border-gray-400 
                         bg-white/70 text-gray-800"
                        >
                          {event.categories[0] || "General"}
                        </span>
                        <span
                          className="px-2 py-1 text-xs rounded-full border border-gray-400 
                         bg-white/70 text-gray-800"
                        >
                          Power & Energy
                        </span>
                      </div>

                      {/* Visit Button */}
                      {/* <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleVisitClick(event.id, event.title)
                        }}
                      >
                        Visit
                      </Button> */}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
