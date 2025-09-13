"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, Heart, User, Star, MapPin, Calendar, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Speaker {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string | null
  bio: string | null
  company: string | null
  jobTitle: string | null
  location: string | null
  website: string | null
  linkedin: string | null
  twitter: string | null
  specialties: string[]
  achievements: string[]
  certifications: string[]
  speakingExperience: string | null
  createdAt: string
  totalEvents?: number
  upcomingEvents?: number
  eventCategories?: string[]
  nextEvent?: any
  rating?: {
    average: number
    count: number
  }
  followers?: number
  isVerified?: boolean
}

interface ApiResponse {
  success: boolean
  speakers: Speaker[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("")
  const [sortBy, setSortBy] = useState("followers")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        setLoading(true)
        const response = await fetch(`/api/speakers?search=${searchQuery}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch speakers')
        }
        
        const data: ApiResponse = await response.json()
        
        if (data.success) {
          // Enhance speaker data with additional properties for UI
          const enhancedSpeakers = data.speakers.map(speaker => ({
            ...speaker,
            // Mock data for UI elements that aren't in your schema yet
            totalEvents: Math.floor(Math.random() * 20) + 1,
            upcomingEvents: Math.floor(Math.random() * 5),
            eventCategories: ["Technology", "Business", "Marketing"].slice(0, Math.floor(Math.random() * 3) + 1),
            rating: {
              average: Math.random() * 2 + 3, // Random rating between 3-5
              count: Math.floor(Math.random() * 100) + 10
            },
            followers: Math.floor(Math.random() * 1000) + 100,
            isVerified: Math.random() > 0.3 // 70% chance of being verified
          }))
          
          setSpeakers(enhancedSpeakers)
        } else {
          throw new Error('Failed to load speakers')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching speakers:', err)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSpeakers()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const toggleFavorite = (speakerId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(speakerId)) {
      newFavorites.delete(speakerId)
    } else {
      newFavorites.add(speakerId)
    }
    setFavorites(newFavorites)
  }

  // Get unique expertise areas and categories for filters
  const allExpertise = useMemo(() => {
    const expertiseSet = new Set<string>()
    speakers.forEach((speaker) => {
      speaker.specialties.forEach((skill) => expertiseSet.add(skill))
    })
    return Array.from(expertiseSet).sort()
  }, [speakers])

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>()
    speakers.forEach((speaker) => {
      if (speaker.eventCategories) {
        speaker.eventCategories.forEach((category) => categorySet.add(category))
      }
    })
    return Array.from(categorySet).sort()
  }, [speakers])

  // Filter and sort speakers
  const filteredSpeakers = useMemo(() => {
    let filtered = speakers

    // Search filter (already handled by API, but we can do additional filtering)
    if (selectedCategory) {
      filtered = filtered.filter((speaker) => 
        speaker.eventCategories?.some((category) => category === selectedCategory)
      )
    }

    // Expertise filter
    if (selectedExpertise) {
      filtered = filtered.filter((speaker) => speaker.specialties.includes(selectedExpertise))
    }

    // Sort speakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating?.average || 0) - (a.rating?.average || 0)
        case "events":
          return (b.totalEvents || 0) - (a.totalEvents || 0)
        case "followers":
        default:
          return (b.followers || 0) - (a.followers || 0)
      }
    })

    return filtered
  }, [speakers, selectedCategory, selectedExpertise, sortBy])

  const handleSpeakerClick = (speakerId: string) => {
    router.push(`/speakers/${speakerId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-900 text-xl">Loading speakers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search speakers by name, expertise, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

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
                {filteredSpeakers.reduce((sum, speaker) => sum + (speaker.totalEvents || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(
                  filteredSpeakers.reduce((sum, speaker) => sum + (speaker.rating?.average || 0), 0) / 
                  (filteredSpeakers.length || 1)
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
                    <AvatarImage 
                      src={speaker.avatar || `/placeholder.svg?height=80&width=80&text=${speaker.firstName[0]}${speaker.lastName[0]}`} 
                      alt={`${speaker.firstName} ${speaker.lastName}`} 
                    />
                    <AvatarFallback className="text-sm font-semibold bg-blue-100 text-blue-600">
                      {speaker.firstName[0]}{speaker.lastName[0]}
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
                    <h3 className="text-sm font-semibold text-blue-600">
                      {speaker.firstName} {speaker.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{speaker.jobTitle}</p>
                    {speaker.company && (
                      <p className="text-xs text-blue-500">{speaker.company}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{(speaker.rating?.average || 0).toFixed(1)}</span>
                    </div>
                    <div>{speaker.totalEvents} Events</div>
                    <div>{speaker.followers} Follows</div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {speaker.specialties.slice(0, 2).map((skill, index) => (
                      <Badge
                        key={index}
                        className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {speaker.specialties.length > 2 && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700">
                        +{speaker.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
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