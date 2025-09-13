"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, Heart, User, Star, MapPin, Calendar, CheckCircle } from "lucide-react"
import { speakers, getAllEvents, getEventsBySpeaker } from "@/lib/data/events"
import { useRouter } from "next/navigation"

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("")
  const [sortBy, setSortBy] = useState("followers") // followers, rating, events
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleFavorite = (speakerId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(speakerId)) {
      newFavorites.delete(speakerId)
    } else {
      newFavorites.add(speakerId)
    }
    setFavorites(newFavorites)
  }

  // Get all events to calculate speaker statistics
  const allEvents = getAllEvents()

  // Enhanced speaker data with event statistics
  const enhancedSpeakers = useMemo(() => {
    return speakers.map((speaker) => {
      const { upcoming, past } = getEventsBySpeaker(speaker.id)
      const totalEvents = upcoming.length + past.length
      const upcomingEvents = upcoming.length

      // Get unique categories from speaker's events
      const eventCategories = [...upcoming, ...past]
        .flatMap((event) => event.categories)
        .filter((category, index, arr) => arr.indexOf(category) === index)

      return {
        ...speaker,
        totalEvents,
        upcomingEvents,
        eventCategories,
        nextEvent: upcoming[0] || null,
      }
    })
  }, [speakers])

  // Get unique expertise areas and categories for filters
  const allExpertise = useMemo(() => {
    const expertiseSet = new Set<string>()
    speakers.forEach((speaker) => {
      speaker.expertise.forEach((skill) => expertiseSet.add(skill))
    })
    return Array.from(expertiseSet).sort()
  }, [])

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>()
    enhancedSpeakers.forEach((speaker) => {
      speaker.eventCategories.forEach((category) => categorySet.add(category))
    })
    return Array.from(categorySet).sort()
  }, [enhancedSpeakers])

  // Filter and sort speakers
  const filteredSpeakers = useMemo(() => {
    let filtered = enhancedSpeakers

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (speaker) =>
          speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          speaker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          speaker.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          speaker.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((speaker) => speaker.eventCategories.some((category) => category === selectedCategory))
    }

    // Expertise filter
    if (selectedExpertise) {
      filtered = filtered.filter((speaker) => speaker.expertise.includes(selectedExpertise))
    }

    // Sort speakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating.average - a.rating.average
        case "events":
          return b.totalEvents - a.totalEvents
        case "followers":
        default:
          return b.followers - a.followers
      }
    })

    return filtered
  }, [enhancedSpeakers, searchQuery, selectedCategory, selectedExpertise, sortBy])

  const handleSpeakerClick = (speakerId: string) => {
    router.push(`/speakers/${speakerId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Top Speakers</h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover industry experts and thought leaders from around the world
              </p>

              Search Bar
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search speakers by name, expertise, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>
          </div>
        </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredSpeakers.length}</div>
              <div className="text-sm text-gray-600">Speakers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredSpeakers.reduce((sum, speaker) => sum + speaker.totalEvents, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(
                  filteredSpeakers.reduce((sum, speaker) => sum + speaker.rating.average, 0) / filteredSpeakers.length
                ).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Expertise Filter */}
            <div className="relative">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Expertise</option>
                {allExpertise.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="followers">Sort by Followers</option>
                <option value="rating">Sort by Rating</option>
                <option value="events">Sort by Events</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedCategory || selectedExpertise || searchQuery) && (
          <div className="mb-6 flex items-center space-x-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Search: {searchQuery}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedExpertise && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Expertise: {selectedExpertise}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("")
                setSelectedExpertise("")
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Speakers Grid */}
        {filteredSpeakers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No speakers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <div
                key={speaker.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex hover:shadow-md transition-all duration-200 relative cursor-pointer group"
                onClick={() => handleSpeakerClick(speaker.id)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(speaker.id)
                  }}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full z-10"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.has(speaker.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                      }`}
                  />
                </button>

                {/* Left: Image */}
                <div className="relative w-20 h-20 shrink-0">
                  <Avatar className="w-20 h-20 border-2 border-blue-100">
                    <AvatarImage src={speaker.image || "/placeholder.svg"} alt={speaker.name} />
                    <AvatarFallback className="text-sm font-semibold bg-blue-100 text-blue-600">
                      {speaker.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {speaker.isVerified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div className="ml-4 flex flex-col justify-between flex-1">
                  {/* Top Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600">{speaker.name}</h3>
                    <p className="text-xs text-gray-500">{speaker.title}</p>
                    {speaker.company && (
                      <p className="text-xs text-blue-500">{speaker.company}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{speaker.rating.average}</span>
                    </div>
                    <div>{speaker.totalEvents} Events</div>
                    <div>{speaker.followers} Follows</div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {speaker.expertise.slice(0, 2).map((skill, index) => (
                      <Badge
                        key={index}
                        className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {speaker.expertise.length > 2 && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700">
                        +{speaker.expertise.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                 
              </div>
            </div>
            ))}
           
          </div>
          
        )}

        {/* Load More Button - Future Enhancement */}
        {filteredSpeakers.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Showing {filteredSpeakers.length} of {speakers.length} speakers
              </p>
              {/* Future: Add pagination or load more functionality */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
