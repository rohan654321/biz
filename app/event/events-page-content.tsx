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
  X,
} from "lucide-react"
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
  eventType: string
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
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [rating, setRating] = useState("")

  // Enhanced sidebar state
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [formatOpen, setFormatOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [relatedTopicOpen, setRelatedTopicOpen] = useState(true)
  const [entryFeeOpen, setEntryFeeOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRelatedTopics, setSelectedRelatedTopics] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

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
    const image = event.images?.[0] || event.image || DEFAULT_EVENT_IMAGE
    
    if (typeof image === 'string') {
      return image
    } else if (image && typeof image === 'object' && image.url) {
      return image.url
    }
    
    return DEFAULT_EVENT_IMAGE
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

        const categories = Array.isArray(event.category)
          ? event.category
          : Array.isArray(event.categories)
            ? event.categories
            : []

        return {
          ...event,
          id: String(resolvedId || ""),
          eventType: event.eventType || categories?.[0] || "Other",
          timings: {
            startDate: event.startDate,
            endDate: event.endDate,
          },
          location: {
            address: event.venue?.venueAddress || "Not Added",
          },
          featured: event.tags?.includes("featured") || false,
          categories: categories,
          tags: event.tags || [],
          images: event.images || ["/images/gpex.jpg"],
          pricing: event.pricing || { general: 0 },
          rating: { average: avg },
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
    if (!eventId) {
      toast({
        title: "Invalid event",
        description: "We could not identify this event. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

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
        try {
          alert(`Thanks for visiting "${eventTitle}"!`)
        } catch {
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

  // Categories
  const categories = useMemo(() => {
    if (!events || events.length === 0) return []

    const categoryMap = new Map<string, number>()
    
    events.forEach((event) => {
      if (event.categories && Array.isArray(event.categories)) {
        event.categories.forEach((category) => {
          if (category && typeof category === 'string') {
            const normalized = category.trim()
            if (normalized) {
              categoryMap.set(normalized, (categoryMap.get(normalized) || 0) + 1)
            }
          }
        })
      }
    })
    
    if (categoryMap.size > 0) {
      return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    }
    
    // Fallback categories
    const hardcodedCategories = [
      "Education Training",
      "Medical & Pharma",
      "IT & Technology",
      "Banking & Finance",
      "Business Services",
      "Industrial Engineering",
      "Building & Construction",
      "Power & Energy",
      "Entertainment & Media",
      "Wellness, Health & Fitness",
    ]

    return hardcodedCategories.map((categoryName) => {
      const count = events.filter((event) => {
        if (!event.categories || !Array.isArray(event.categories)) return false
        return event.categories.some((cat) => {
          if (!cat || typeof cat !== 'string') return false
          return cat.toLowerCase().includes(categoryName.toLowerCase())
        })
      }).length
      return { name: categoryName, count }
    }).filter(cat => cat.count > 0)
  }, [events])

  // Formats
  const formats = useMemo(() => {
    const formatMap = new Map<string, number>()
    
    formatMap.set("All Formats", events.length)
    
    events.forEach((event) => {
      let formatName = ""
      
      if (event.eventType && typeof event.eventType === 'string') {
        formatName = event.eventType.trim()
      } 
      else if (event.categories && Array.isArray(event.categories) && event.categories.length > 0) {
        const firstCategory = event.categories[0]
        if (typeof firstCategory === 'string') {
          formatName = firstCategory.trim()
        }
      }
      
      if (!formatName) {
        formatName = "Other"
      }
      
      const normalizedFormat = formatName.toLowerCase()
      if (normalizedFormat.includes("trade show") || normalizedFormat.includes("tradeshow")) {
        formatName = "Trade Show"
      } else if (normalizedFormat.includes("conference")) {
        formatName = "Conference"
      } else if (normalizedFormat.includes("workshop") || normalizedFormat.includes("workshops")) {
        formatName = "Workshops"
      } else if (normalizedFormat.includes("exhibition") || normalizedFormat.includes("expo")) {
        formatName = "Exhibition"
      } else if (normalizedFormat.includes("seminar")) {
        formatName = "Seminar"
      } else if (normalizedFormat.includes("meetup") || normalizedFormat.includes("meeting")) {
        formatName = "Meetup"
      }
      
      formatMap.set(formatName, (formatMap.get(formatName) || 0) + 1)
    })
    
    const allFormatsCount = formatMap.get("All Formats") || 0
    formatMap.delete("All Formats")
    
    const formatArray = Array.from(formatMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
    
    return [
      { name: "All Formats", count: allFormatsCount },
      ...formatArray
    ]
  }, [events])

  // Locations
  const locations = useMemo(() => {
    if (!events || events.length === 0) return []

    const locationMap = new Map<string, number>()
    
    events.forEach((event) => {
      let locationKey = ""
      
      if (event.venue?.venueCity) {
        locationKey = event.venue.venueCity.trim()
      } 
      else if (event.location?.city) {
        locationKey = event.location.city.trim()
      }
      else if (event.venue?.venueCountry) {
        locationKey = event.venue.venueCountry.trim()
      }
      else if (event.location?.address) {
        const addressParts = event.location.address.split(',')
        locationKey = addressParts[0]?.trim() || "Unknown"
      }
      
      if (locationKey && locationKey !== "Not Added" && locationKey !== "Unknown") {
        locationMap.set(locationKey, (locationMap.get(locationKey) || 0) + 1)
      }
    })
    
    return Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count
        }
        return a.name.localeCompare(b.name)
      })
  }, [events])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.name.toLowerCase().includes(categorySearch.toLowerCase()))
  }, [categories, categorySearch])

  // Related topics
  const relatedTopics = useMemo(() => {
    return categories.map((cat) => ({ ...cat, name: `${cat.name} Related` }))
  }, [categories])

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isEventOnDate = (event: Event, date: Date) => {
    const eventStartDate = new Date(event.timings.startDate)
    const eventEndDate = new Date(event.timings.endDate)

    return (
      date >= new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate()) &&
      date <= new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate())
    )
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setCalendarOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const clearDateFilter = () => {
    setSelectedDate(null)
    setSelectedDateRange("")
  }

  const clearLocationFilter = () => {
    setSelectedLocation("")
  }

  const clearFormatFilter = () => {
    setSelectedFormat("All Formats")
  }

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

    // Date filter (specific date selection)
    if (selectedDate) {
      filtered = filtered.filter((event) => isEventOnDate(event, selectedDate))
    }

    // Date range filter
    if (selectedDateRange && !selectedDate) {
      filtered = filtered.filter((event) => isEventInDateRange(event, selectedDateRange))
    }

    // Search filter
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

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        event.categories?.some((cat) =>
          selectedCategories.some((selectedCat) => 
            cat.toLowerCase().trim() === selectedCat.toLowerCase().trim()
          )
        )
      )
    } else if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categories?.some((cat) => 
          cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
        )
      )
    }

    // Related topics filter
    if (selectedRelatedTopics.length > 0) {
      const relatedCats = selectedRelatedTopics.map((topic) => topic.replace(" Related", ""))
      filtered = filtered.filter((event) => event.categories.some((cat) => relatedCats.includes(cat)))
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((event) => {
        const searchTerm = selectedLocation.toLowerCase()
        
        const venueCity = event.venue?.venueCity?.toLowerCase() || ""
        const venueCountry = event.venue?.venueCountry?.toLowerCase() || ""
        const eventCity = event.location?.city?.toLowerCase() || ""
        const eventAddress = event.location?.address?.toLowerCase() || ""
        
        return venueCity.includes(searchTerm) || 
               venueCountry.includes(searchTerm) || 
               eventCity.includes(searchTerm) || 
               eventAddress.includes(searchTerm)
      })
    }

    // Format filter
    if (selectedFormat && selectedFormat !== "All Formats") {
      filtered = filtered.filter((event) => {
        const eventType = event.eventType || event.categories?.[0] || ""
        const eventTypeStr = String(eventType).toLowerCase().trim()
        const selectedFormatStr = String(selectedFormat).toLowerCase().trim()
        return eventTypeStr === selectedFormatStr
      })
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

    return filtered
  }, [
    events,
    activeTab,
    selectedDate,
    selectedDateRange,
    searchQuery,
    selectedCategory,
    selectedCategories,
    selectedRelatedTopics,
    selectedLocation,
    selectedFormat,
    priceRange,
    rating,
  ])

  // Dynamic banner title based on filters
  const getBannerTitle = () => {
    if (selectedDate) {
      return `Events on ${selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
    }
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
    return "All Events"
  }

  const getFollowerCount = () => {
    const total = filteredEvents.reduce((sum, ev) => sum + (visitorCounts[ev.id] || 0), 0)
    if (total >= 1000) return `${Math.round(total / 1000)}K+ Followers`
    return `${total} Followers`
  }

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Featured events
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
    setSelectedDate(null)
    setSelectedDateRange("")
    setSelectedFormat("All Formats")
    setPriceRange("")
    setRating("")
    setActiveTab("All Events")
    setCurrentPage(1)
    router.push("/event")
  }

  // Calendar rendering
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const days = []

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const daysInPrevMonth = getDaysInMonth(prevMonth)

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day)
      days.push(
        <div
          key={`prev-${day}`}
          className="h-8 w-8 flex items-center justify-center text-sm text-gray-400 cursor-not-allowed"
        >
          {day}
        </div>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const hasEvents = events.some((event) => isEventOnDate(event, date))
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      const isToday = isSameDay(date, new Date())

      days.push(
        <button
          key={`current-${day}`}
          onClick={() => handleDateSelect(date)}
          className={`h-8 w-8 flex items-center justify-center text-sm rounded-full relative
            ${isSelected ? "bg-blue-600 text-white" : isToday ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}
            ${hasEvents ? "font-semibold" : ""}
          `}
        >
          {day}
          {hasEvents && <div className="absolute bottom-0 w-1 h-1 bg-blue-500 rounded-full"></div>}
        </button>,
      )
    }

    return days
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
    selectedDate,
    selectedDateRange,
    priceRange,
    rating,
  ])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2 text-lg font-medium">Loading events...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500 mb-4 text-lg font-semibold">Error: {error}</p>
        <Button onClick={fetchEvents} variant="outline" className="font-medium">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full py-6">
          {/* Dynamic Banner Section */}
          <div
            className="flex items-center justify-between mb-8 p-8 border border-blue-200 bg-cover bg-center bg-no-repeat relative overflow-hidden rounded-2xl shadow-md"
            style={{
              backgroundImage: "url('/city/c2.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-blue-50/40 to-purple-50/50"></div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                {getBannerTitle()}
              </h1>
              <p className="text-gray-800 text-lg sm:text-xl font-semibold">{getFollowerCount()}</p>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {selectedDate && (
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                <span className="font-bold">Date:</span> {selectedDate.toLocaleDateString()}
                <X className="w-4 h-4 cursor-pointer ml-1" onClick={clearDateFilter} />
              </Badge>
            )}
            {selectedLocation && (
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                <span className="font-bold">Location:</span> {selectedLocation}
                <X className="w-4 h-4 cursor-pointer ml-1" onClick={clearLocationFilter} />
              </Badge>
            )}
            {selectedFormat !== "All Formats" && (
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                <span className="font-bold">Format:</span> {selectedFormat}
                <X className="w-4 h-4 cursor-pointer ml-1" onClick={clearFormatFilter} />
              </Badge>
            )}
            {(selectedDate || selectedLocation || selectedFormat !== "All Formats") && (
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="font-semibold">
                Clear All
              </Button>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-base font-semibold border-b-4 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-700 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Sidebar */}
            <div className="w-full lg:w-80 lg:sticky lg:top-8 self-start flex-shrink-0">
              <Card className="border-2 border-gray-300 shadow-lg bg-white rounded-2xl">
                <CardContent className="p-0">
                  {/* Calendar Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setCalendarOpen(!calendarOpen)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 rounded-t-2xl"
                    >
                      <span className="text-gray-900 font-bold text-lg">📅 Calendar</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${calendarOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {calendarOpen && (
                      <div className="px-5 pb-5">
                        {/* Quick Date Filters */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          {[
                            { label: "Today", value: "today" },
                            { label: "Tomorrow", value: "tomorrow" },
                            { label: "This Week", value: "this-week" },
                            { label: "This Month", value: "this-month" },
                          ].map((range) => (
                            <button
                              key={range.value}
                              onClick={() => {
                                setSelectedDateRange(range.value)
                                setSelectedDate(null)
                              }}
                              className={`p-3 text-sm text-center rounded-lg border-2 font-medium ${
                                selectedDateRange === range.value
                                  ? "bg-blue-100 border-blue-600 text-blue-800 font-bold"
                                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>

                        {/* Calendar */}
                        <div className="bg-white rounded-xl border-2 border-gray-300 p-4">
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                              <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">
                              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                              <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                          </div>

                          {/* Calendar Days */}
                          <div className="grid grid-cols-7 gap-2 mb-3">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                              <div key={day} className="text-sm font-bold text-gray-600 text-center">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                        </div>

                        {selectedDate && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <p className="text-sm font-semibold text-blue-800">
                              Showing events for {selectedDate.toLocaleDateString()}
                            </p>
                            <button
                              onClick={clearDateFilter}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
                            >
                              Clear date filter
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Format Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setFormatOpen(!formatOpen)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
                    >
                      <span className="text-gray-900 font-bold text-lg">🎯 Format</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${formatOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {formatOpen && (
                      <div className="px-5 pb-5">
                        <div className="space-y-3">
                          {/* All Formats option */}
                          <button
                            onClick={() => setSelectedFormat("All Formats")}
                            className={`w-full text-left p-3 rounded-xl text-base flex justify-between items-center font-medium ${
                              selectedFormat === "All Formats" 
                                ? "bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold" 
                                : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            <span>All Formats</span>
                          </button>

                          {/* Dynamic Formats */}
                          {formats.map((format, index) => (
                            <button
                              key={`${format.name}-${index}`}
                              onClick={() => setSelectedFormat(format.name)}
                              className={`w-full text-left p-3 rounded-xl text-base flex justify-between items-center font-medium ${
                                selectedFormat === format.name 
                                  ? "bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold" 
                                  : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              <span>{format.name}</span>
                              <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                {format.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setLocationOpen(!locationOpen)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
                    >
                      <span className="text-gray-900 font-bold text-lg">📍 Location</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${locationOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {locationOpen && (
                      <div className="px-5 pb-5">
                        <div className="relative mb-4">
                          <Input
                            type="text"
                            placeholder="Search locations..."
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="text-base pr-10 border-2 border-gray-300 rounded-xl py-3 font-medium"
                          />
                          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                        <div className="space-y-3 max-h-72 overflow-y-auto">
                          {locations.map((location) => (
                            <button
                              key={location.name}
                              onClick={() => setSelectedLocation(location.name)}
                              className={`w-full text-left p-3 rounded-xl text-base flex justify-between items-center font-medium ${
                                selectedLocation === location.name 
                                  ? "bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold" 
                                  : "hover:bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              <span>{location.name}</span>
                              <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                {location.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
                    >
                      <span className="text-gray-900 font-bold text-lg">🏷️ Category</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {categoryOpen && (
                      <div className="px-5 pb-5">
                        <div className="relative mb-4">
                          <Input
                            type="text"
                            placeholder="Search for Topics..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="text-base pr-10 border-2 border-gray-300 rounded-xl py-3 font-medium"
                          />
                          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                        <div className="space-y-4">
                          {filteredCategories
                            .slice(0, showAllCategories ? filteredCategories.length : 10)
                            .map((category) => (
                              <div key={category.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryToggle(category.name)}
                                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500"
                                  />
                                  <span className="text-base font-medium text-gray-800">{category.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                  {category.count}
                                </span>
                              </div>
                            ))}
                        </div>
                        {filteredCategories.length > 10 && (
                          <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="w-full mt-4 text-base font-bold text-blue-600 hover:text-blue-800"
                          >
                            {showAllCategories ? "View Less" : "View All Categories"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="p-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="text-red-600 font-bold text-lg mb-2">🔥 Top 100 Events</h3>
                    <p className="text-gray-600 font-medium">Discover and track top events</p>
                  </div>

                  <div className="p-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="text-red-600 font-bold text-lg mb-2">🎤 Explore Speaker</h3>
                    <p className="text-gray-600 font-medium">Discover and track top events</p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="w-full p-5 text-left hover:bg-gray-50 transition-colors cursor-pointer rounded-b-2xl"
                  >
                    <h3 className="text-blue-600 font-bold text-lg">All Events</h3>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full min-w-0">
              {/* View Toggle and Results Count */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <span className="text-base font-semibold text-gray-700">
                  Showing <span className="text-blue-600 font-bold">{paginatedEvents.length}</span> of{" "}
                  <span className="text-blue-600 font-bold">{filteredEvents.length}</span> events
                </span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="font-semibold text-gray-700 border-2"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-base font-bold ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="font-semibold text-gray-700 border-2"
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-6">
                {paginatedEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <p className="text-gray-500 text-2xl font-bold mb-4">No events found matching your criteria</p>
                    <Button variant="outline" className="mt-4 font-semibold text-lg px-8 py-3" onClick={clearAllFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  paginatedEvents.map((event) => (
                    <Link href={`/event/${event.id}`} key={event.id} className="block">
                      <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full transform hover:-translate-y-1">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image Section */}
                            <div className="relative w-full sm:w-40 md:w-48 lg:w-56 h-64 sm:h-auto p-8">
                              <img
                                src={getEventImage(event) || "/placeholder.svg"}
                                alt={event.title}
                                className="object-cover w-full h-full rounded-lg"
                              />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 flex flex-col p-6 sm:p-8">
                              {/* Top Section */}
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                                    {event.title}
                                  </h3>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                                    <div className="flex items-center text-gray-700">
                                      <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                                      <span className="text-base font-semibold truncate">
                                        {event.location?.address || "Address not available"}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                      <Calendar className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
                                      <span className="text-base font-semibold">{formatDate(event.timings.startDate)}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-blue-200">
                                      💰 Paid entry
                                    </Badge>
                                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                                      <Star className="w-5 h-5 fill-current" />
                                      <span className="text-lg">
                                        {Number.isFinite(event.rating?.average)
                                          ? event.rating.average.toFixed(1)
                                          : "4.5"}
                                      </span>
                                      {event.totalReviews && event.totalReviews > 0 && (
                                        <span className="text-sm text-gray-600 ml-2 font-medium">
                                          ({event.totalReviews} reviews)
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center text-gray-700 text-base gap-2 font-semibold">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-500"
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

                                <div className="flex flex-col items-start sm:items-end gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8">
                                      <img
                                        src="/images/VerifiedBadge.png"
                                        alt="Verified"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <span className="text-gray-700 font-bold text-base">2nd Edition</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {event.categories?.slice(0, 2).map((category: string, idx: number) => (
                                      <Badge
                                        key={idx}
                                        className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-bold border border-gray-300"
                                      >
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="border-t-2 border-gray-200 my-5" />

                              {/* Bottom Section */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 text-xl flex-shrink-0">
                                    {typeof event.organizer === "string"
                                      ? event.organizer.charAt(0)
                                      : event.organizer?.name?.charAt(0) || "M"}
                                  </div>
                                  <span className="text-lg font-semibold text-gray-800 truncate">
                                    {typeof event.organizer === "string"
                                      ? event.organizer
                                      : event.organizer?.name || "Maxx Business Media Pvt Ltd"}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4">
                                  <ShareButton id={event.id} title={event.title} type="event" />
                                  
                                  <BookmarkButton
                                    eventId={event.id}
                                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={(e: React.MouseEvent) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleVisitClick(event.id, event.title)
                                    }}
                                  >
                                    Save
                                  </BookmarkButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Featured Events */}
              {featuredEvents.length > 0 && (
                <section className="py-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 underline decoration-blue-600 decoration-4">
                      ✨ Featured Events
                    </h2>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                        className="p-3 border-2"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() =>
                          setCurrentSlide((prev) => Math.min(Math.ceil(featuredEvents.length / 3) - 1, prev + 1))
                        }
                        className="p-3 border-2"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredEvents.slice(currentSlide * 3, currentSlide * 3 + 3).map((event) => (
                      <Card key={event.id} className="hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-300 rounded-2xl overflow-hidden">
                        <div className="relative">
                          <img
                            src={getEventImage(event) || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-xl">
                            <Heart className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            Featured ✨
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
                          <div className="flex items-center text-base text-gray-700 mb-2 font-medium">
                            <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                            <span>{event.location?.city || "Location TBD"}</span>
                          </div>
                          <div className="flex items-center text-base text-gray-700 mb-4 font-medium">
                            <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                            <span>{formatDate(event.timings.startDate)}</span>
                          </div>
                          <div className="flex items-center justify-between mb-5">
                            <Badge className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1.5 border-2 border-blue-200">
                              {event.categories[0]}
                            </Badge>
                            <span className="text-lg font-bold text-green-700">
                              ⭐ {Number.isFinite(event.rating?.average) ? event.rating.average.toFixed(1) : "4.5"}
                            </span>
                          </div>
                          <button
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 px-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleVisitClick(event.id, event.title)
                            }}
                          >
                            Visit Event
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-6 space-x-3">
                    {Array.from({ length: Math.ceil(featuredEvents.length / 3) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i === currentSlide ? "bg-blue-600 w-10" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-80 space-y-8 self-start">
              <AdCard />

              {featuredEvents[0] && (
                <Card className="bg-white shadow-2xl border-2 border-gray-300 rounded-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={getEventImage(featuredEvents[0]) || "/placeholder.svg"}
                      alt={featuredEvents[0].title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-xl">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <Badge className="bg-blue-600 text-white text-sm font-bold px-3 py-1">Expo</Badge>
                      <Badge className="bg-blue-600 text-white text-sm font-bold px-3 py-1">Business Event</Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-base font-bold shadow-lg">
                      ⭐ {Number.isFinite(featuredEvents[0].rating?.average)
                        ? featuredEvents[0].rating.average.toFixed(1)
                        : "4.5"}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <button
                      className="w-full flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleVisitClick(featuredEvents[0].id, featuredEvents[0].title)
                      }}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Visit Event
                    </button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">🔥 Trending Events</h3>
                {events.slice(0, 3).map((event) => (
                  <Link key={event.id} href={`/event/${event.id}`} className="group block">
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl p-5 flex gap-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-yellow-200">
                      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white">
                        <img
                          src={getEventImage(event) || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-gray-800 font-semibold mb-3">International Exhibition</p>
                        <div className="flex items-center text-sm font-bold text-gray-800 mb-2">
                          <CalendarDays className="w-4 h-4 mr-2 text-gray-700" />
                          {formatDate(event.timings.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-800 font-medium">
                          <MapPin className="w-4 h-4 mr-2 text-blue-700" />
                          {event.location?.city || "Chennai, India"}
                        </div>
                      </div>
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