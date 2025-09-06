"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users, Star, Phone, Mail, Globe, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Define the Organizer type
interface Organizer {
  id: string
  name: string
  image?: string
  rating: number
  reviewCount: number
  location: string
  country: string
  category: string
  eventsOrganized: number
  yearsOfExperience: number
  specialties: string[]
  description: string
  phone: string
  email: string
  website: string
  verified: boolean
  featured: boolean
  totalAttendees: string
  successRate: number
  nextAvailable: string
}

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
]

const countries = [
  { name: "India", flag: "🇮🇳" },
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "UAE", flag: "🇦🇪" },
]

const categories = [
  { name: "Corporate Events", icon: "🏢" },
  { name: "Weddings", icon: "💒" },
  { name: "Technology", icon: "💻" },
  { name: "Social Events", icon: "🎉" },
  { name: "International", icon: "🌍" },
  { name: "Sports Events", icon: "🏆" },
  { name: "Cultural Events", icon: "🎭" },
  { name: "Educational", icon: "📚" },
]

export default function OrganizersPage() {
  const router = useRouter()
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("rating")

  // Fetch organizers from API
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch("/api/organizers")
        if (response.ok) {
          const data = await response.json()
          setOrganizers(data.organizers || [])
        } else {
          console.error("Failed to fetch organizers")
          // Fallback to empty array if API fails
          setOrganizers([])
        }
      } catch (error) {
        console.error("Error fetching organizers:", error)
        setOrganizers([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizers()
  }, [])

  // Handle card click to navigate to organizer detail page
  const handleCardClick = (organizerId: string) => {
    router.push(`/organizer/${organizerId}`)
  }

  const filteredOrganizers = useMemo(() => {
    const filtered = organizers.filter((organizer) => {
      const matchesSearch =
        organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (organizer.website && organizer.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
        organizer.specialties?.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        false

      const matchesCity =
        selectedCities.length === 0 ||
        (organizer.location && selectedCities.some((city) => organizer.location.includes(city)))

      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(organizer.country)

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(organizer.category)

      return matchesSearch && matchesCity && matchesCountry && matchesCategory
    })

    // Sort organizers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.yearsOfExperience - a.yearsOfExperience
        case "events":
          return b.eventsOrganized - a.eventsOrganized
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [organizers, searchTerm, selectedCities, selectedCountries, selectedCategories, sortBy])

  const toggleFilter = (value: string, selectedArray: string[], setSelectedArray: (arr: string[]) => void) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value))
    } else {
      setSelectedArray([...selectedArray, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedCities([])
    setSelectedCountries([])
    setSelectedCategories([])
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Organizers...</h1>
          <p className="text-gray-600">Please wait while we fetch the best event organizers for you.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-white border border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Discover Organizers</h2>

            {/* Popular Cities */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Popular cities</h3>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleFilter(city, selectedCities, setSelectedCities)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCities.includes(city)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Countries */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Popular countries</h3>
              <div className="grid grid-cols-2 gap-2">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => toggleFilter(country.name, selectedCountries, setSelectedCountries)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                      selectedCountries.includes(country.name)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-sm bg-transparent"
                onClick={() => setSelectedCountries([])}
              >
                Browse All Countries
              </Button>
            </div>

            {/* Collections */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Collections</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => toggleFilter(category.name, selectedCategories, setSelectedCategories)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-3 ${
                      selectedCategories.includes(category.name)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-sm bg-transparent"
                onClick={() => setSelectedCategories([])}
              >
                All Category
              </Button>
            </div>

            {/* Clear Filters */}
            {(selectedCities.length > 0 || selectedCountries.length > 0 || selectedCategories.length > 0) && (
              <Button variant="outline" onClick={clearAllFilters} className="w-full text-sm bg-transparent">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white border-y border-gray-200 px-8 py-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Expert Organizers</h1>
                <p className="text-gray-600">Connect with professional event organizers for your next event</p>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search organizers, companies, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="events">Sort by Events Organized</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>

            {/* Active Filters */}
            {(selectedCities.length > 0 || selectedCountries.length > 0 || selectedCategories.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCities.map((city) => (
                  <Badge key={city} variant="secondary" className="flex items-center gap-1">
                    {city}
                    <button onClick={() => toggleFilter(city, selectedCities, setSelectedCities)}>×</button>
                  </Badge>
                ))}
                {selectedCountries.map((country) => (
                  <Badge key={country} variant="secondary" className="flex items-center gap-1">
                    {country}
                    <button onClick={() => toggleFilter(country, selectedCountries, setSelectedCountries)}>×</button>
                  </Badge>
                ))}
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button onClick={() => toggleFilter(category, selectedCategories, setSelectedCategories)}>×</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredOrganizers.length} organizer{filteredOrganizers.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredOrganizers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No organizers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrganizers.map((organizer) => (
                  <Card
                    key={organizer.id}
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => handleCardClick(organizer.id)}
                  >
                    <div className="relative">
                      <img
                        src={organizer.image || "/placeholder.svg"}
                        alt={organizer.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {organizer.featured && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">Featured</Badge>
                      )}
                      {organizer.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{organizer.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm">{organizer.rating}</span>
                          <span className="text-xs text-gray-500">({organizer.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{organizer.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{organizer.yearsOfExperience} years</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{organizer.eventsOrganized} events</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{organizer.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {organizer.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {organizer.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{organizer.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="font-semibold text-sm">{organizer.totalAttendees}</div>
                          <div className="text-xs text-gray-500">Total Attendees</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{organizer.successRate}%</div>
                          <div className="text-xs text-gray-500">Success Rate</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-green-600">Available</div>
                          <div className="text-xs text-gray-500">{organizer.nextAvailable}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {organizer.category}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                          View Profile
                        </Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
                          Contact Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredOrganizers.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Organizers
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
