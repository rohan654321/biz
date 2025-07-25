"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Share2, Star, MapPin, Calendar, Heart, Bookmark, User } from "lucide-react"
import Image from "next/image"
import { getAllEvents, isEventPostponed, getOriginalEventDates } from "@/lib/data/events"
import { useSearchParams, useRouter } from "next/navigation"
import { Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("All Events")
  const [selectedFormat, setSelectedFormat] = useState("All Formats")
  const [selectedLocation, setSelectedLocation] = useState("")
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("Trending")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [rating, setRating] = useState("")

  const router = useRouter()

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

  const allEvents = getAllEvents()
  const itemsPerPage = 6

  // Get unique categories, locations, and other filter options from data
  const categories = useMemo(() => {
    const categoryMap = new Map()
    allEvents.forEach((event) => {
      event.categories.forEach((cat) => {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      })
    })
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
  }, [allEvents])

  const locations = useMemo(() => {
    const locationMap = new Map()
    allEvents.forEach((event) => {
      const city = event.location.city
      locationMap.set(city, (locationMap.get(city) || 0) + 1)
    })
    return Array.from(locationMap.entries()).map(([name, count]) => ({ name, count }))
  }, [allEvents])

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    let filtered = allEvents

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.categories.some((cat) => cat.toLowerCase().includes(selectedCategory.toLowerCase())),
      )
    }

    // Location filter (works for cities, countries, and venues)
    if (selectedLocation) {
      filtered = filtered.filter(
        (event) =>
          event.location.city.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          event.location.country?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          event.location.venue.toLowerCase().includes(selectedLocation.toLowerCase()),
      )
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
      filtered.sort((a, b) => b.followers - a.followers)
    } else if (viewMode === "Date") {
      filtered.sort((a, b) => new Date(a.timings.startDate).getTime() - new Date(b.timings.startDate).getTime())
    }

    return filtered
  }, [allEvents, searchQuery, selectedCategory, selectedLocation, priceRange, rating, viewMode])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Featured events (events with featured flag)
  const featuredEvents = allEvents.filter((event) => event.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const tabs = ["All Events", "Upcoming", "This Week", "This Month"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
            <p className="text-gray-600">Discover amazing events happening around you</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {allEvents.reduce((sum, event) => sum + event.followers, 0)} Followers
              </span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Follow</Button>
            <Button variant="outline" className="px-4 py-2 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {(categoryFromUrl ||
          searchParams.get("location") ||
          searchParams.get("country") ||
          searchParams.get("venue")) && (
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <div className="flex items-center space-x-2">
              {categoryFromUrl && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Category: {categoryFromUrl}
                </Badge>
              )}
              {searchParams.get("location") && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Location: {searchParams.get("location")}
                </Badge>
              )}
              {searchParams.get("country") && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Country: {searchParams.get("country")}
                </Badge>
              )}
              {searchParams.get("venue") && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Venue: {searchParams.get("venue")}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("")
                  setSelectedLocation("")
                  router.push("/events")
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
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
          {/* Left Sidebar - Filters */}
          <div className="w-80 space-y-6">
            {/* Date & Format Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                      <option value="">All Dates</option>
                      <option value="today">Today</option>
                      <option value="tomorrow">Tomorrow</option>
                      <option value="this-week">This Week</option>
                      <option value="this-month">This Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                    >
                      <option value="All Formats">All Formats</option>
                      <option value="Conference">Conference</option>
                      <option value="Expo">Expo</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Festival">Festival</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location.name} value={location.name}>
                          {location.name} ({location.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Categories</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.name}
                            onChange={() =>
                              setSelectedCategory(selectedCategory === category.name ? "" : category.name)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300"
                          />
                          <span
                            className={`text-sm ${selectedCategory === category.name ? "text-blue-600 font-medium" : "text-gray-700"}`}
                          >
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    ))}
                  </div>
                  {selectedCategory && (
                    <Button
                      variant="outline"
                      className="w-full text-sm bg-transparent"
                      onClick={() => setSelectedCategory("")}
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Price Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Price Range</h3>
                  <div className="space-y-3">
                    {[
                      { value: "", label: "All Prices" },
                      { value: "free", label: "Free" },
                      { value: "under-1000", label: "Under ₹1,000" },
                      { value: "1000-5000", label: "₹1,000 - ₹5,000" },
                      { value: "above-5000", label: "Above ₹5,000" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === option.value}
                          onChange={() => setPriceRange(option.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Minimum Rating</h3>
                  <div className="space-y-3">
                    {["", "4.5", "4.0", "3.5", "3.0"].map((ratingValue) => (
                      <div key={ratingValue} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="rating"
                          checked={rating === ratingValue}
                          onChange={() => setRating(ratingValue)}
                          className="w-4 h-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          {ratingValue ? `${ratingValue}+ Stars` : "All Ratings"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
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
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === "Trending" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Trending 🔥
                  </button>
                  <button
                    onClick={() => setViewMode("Date")}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === "Date" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Date
                  </button>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded text-sm ${
                        currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
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
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Event Listings */}
            <div className="space-y-4">
              {paginatedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No events found matching your criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("")
                      setSelectedLocation("")
                      setPriceRange("")
                      setRating("")
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                paginatedEvents.map((event) => {
                  const isPostponed = isEventPostponed(event.id)
                  const originalDates = getOriginalEventDates(event.id)

                  return (
                    <Link href={`/event/${event.id}`} key={event.id} className="block">
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative">
                              <Image
                                src={event.images[0]?.url || "/placeholder.svg"}
                                alt={event.title}
                                width={176}
                                height={112}
                                className="w-44 h-28 object-cover rounded-lg"
                              />
                              {event.vip && (
                                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-xs">VIP</Badge>
                              )}
                              {isPostponed && (
                                <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Postponed
                                </Badge>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {isPostponed && originalDates.startDate && originalDates.endDate ? (
                                      <span className="text-gray-400 line-through">
                                        {formatDate(originalDates.startDate)} - {formatDate(originalDates.endDate)}
                                      </span>
                                    ) : (
                                      <span className={isPostponed ? "text-gray-400" : ""}>
                                        {formatDate(event.timings.startDate)} - {formatDate(event.timings.endDate)}
                                      </span>
                                    )}
                                    {isPostponed && <span className="text-orange-600 font-medium ml-2">Postponed</span>}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location.city}, {event.location.venue}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Heart className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                              {/* Postponed reason */}
                              {isPostponed && event.postponedReason && (
                                <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 rounded-lg">
                                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm text-orange-700">{event.postponedReason}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {event.categories.map((category, idx) => (
                                    <Badge key={idx} variant="secondary">
                                      {category}
                                    </Badge>
                                  ))}
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-1" />
                                    {event.followers} followers
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                      {event.rating.average}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-blue-600">
                                    {event.pricing.currency}
                                    {event.pricing.general === 0 ? "Free" : event.pricing.general}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <section className="py-8">
                <h2 className="text-xl font-semibold text-black underline mb-6">Featured Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {featuredEvents.map((event) => {
                    const isPostponed = isEventPostponed(event.id)
                    const originalDates = getOriginalEventDates(event.id)

                    return (
                      <Link href={`/event/${event.id}`} key={event.id} className="block">
                        <div key={event.id} className="relative bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="relative h-32 w-full">
                            <Image
                              src={event.images[0]?.url || "/placeholder.svg"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </div>
                            {isPostponed && (
                              <Badge className="absolute top-2 left-2 bg-orange-100 text-orange-800 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Postponed
                              </Badge>
                            )}
                          </div>
                          <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md">
                            <Image
                              src={event.logo || "/placeholder.svg"}
                              alt="Event Logo"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="pt-6 pb-4 px-4 text-center">
                            <h3 className="font-semibold text-base text-gray-800">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.location.city}</p>
                            <p
                              className={`text-sm font-medium mt-2 ${isPostponed ? "text-gray-400 line-through" : "text-blue-600"}`}
                            >
                              {isPostponed && originalDates.startDate
                                ? formatDate(originalDates.startDate)
                                : formatDate(event.timings.startDate)}
                            </p>
                            {isPostponed && <p className="text-xs text-orange-600 mt-1">Postponed</p>}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Large Featured Event */}
            {featuredEvents[0] && (
              <Card className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={featuredEvents[0].images[0]?.url || "/placeholder.svg"}
                    alt={featuredEvents[0].title}
                    width={320}
                    height={240}
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{featuredEvents[0].title}</h3>
                    <p className="text-sm">{formatDate(featuredEvents[0].timings.startDate)}</p>
                    <p className="text-sm">{featuredEvents[0].location.city}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Event List */}
            <div className="space-y-4">
              {allEvents.slice(0, 3).map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Image
                        src={event.images[0]?.url || "/placeholder.svg"}
                        alt={event.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{formatDate(event.timings.startDate)}</p>
                        <p className="text-xs text-gray-600 mb-2">{event.location.city}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{event.followers} followers</span>
                          <div className="flex space-x-1">
                            {event.categories.slice(0, 2).map((category, idx) => (
                              <Button key={idx} size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700">
                                {category}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Bookmark className="w-4 h-4" />
                      </Button>
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
