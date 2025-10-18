"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Camera,
  Building2,
  Users2,
  Utensils,
  Trophy,
  Music,
  Loader2,
} from "lucide-react"

interface Venue {
  id: string
  logo: string
  contactPerson: string
  email: string
  mobile: string
  address: string
  website: string
  description: string
  totalEvents: number
  activeBookings: number
  amenities: string[]
  meetingSpaces: any[]
  isVerified: boolean
  venueName: string
  venueDescription?: string
  venueAddress?: string
  maxCapacity: number | null
  totalHalls: number | null
  averageRating: number
  totalReviews: number
}

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch venues only once on component mount
  useEffect(() => {
    fetchVenues()
  }, []) // Empty dependency array - fetch only once

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/venue-manager")
      if (!response.ok) {
        throw new Error("Failed to fetch venues")
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.venues)) {
        setVenues(data.venues)
      } else {
        setVenues([])
      }
      setError(null)
    } catch (err) {
      setError("Failed to load venues. Please try again.")
      setVenues([])
      console.error("Error fetching venues:", err)
    } finally {
      setLoading(false)
    }
  }

  const popularCities = ["Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon", "Noida", "Mumbai"]

  const popularCountries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "India", flag: "🇮🇳" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "South Africa", flag: "🇿🇦" },
  ]

  const collections = [
    { name: "Hotels & Resorts", icon: Building2 },
    { name: "Conference Centres", icon: Users2 },
    { name: "Banquets & Halls", icon: Utensils },
    { name: "Exhibition & Convention Centres", icon: Building2 },
    { name: "Sports Complexes", icon: Trophy },
    { name: "Auditoriums", icon: Music },
  ]

  // Helper function to extract city from address
  const extractCityFromAddress = (address: string): string => {
    if (!address) return ""
    
    // Convert to lowercase for case-insensitive matching
    const lowerAddress = address.toLowerCase()
    
    // Check for each popular city in the address
    for (const city of popularCities) {
      if (lowerAddress.includes(city.toLowerCase())) {
        return city
      }
    }
    
    // If no popular city found, try to extract city using common patterns
    const cityMatch = address.match(/(?:^|,\s*)([A-Za-z\s]+)(?:,|$)/)
    return cityMatch ? cityMatch[1].trim() : ""
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "parking":
        return <Car className="w-4 h-4" />
      case "catering":
        return <Coffee className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      case "av":
        return <Camera className="w-4 h-4" />
      default:
        return null
    }
  }

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return "WiFi"
      case "parking":
        return "Parking"
      case "catering":
        return "Catering"
      case "security":
        return "Security"
      case "av":
        return "AV Equipment"
      default:
        return amenity
    }
  }

  const toggleCityFilter = (city: string) => {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]))
  }

  const toggleCountryFilter = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const toggleCollectionFilter = (collection: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collection) ? prev.filter((c) => c !== collection) : [...prev, collection],
    )
  }

  const displayName = (v: Venue) => (v.venueName && v.venueName.trim() ? v.venueName : "Unnamed Venue")

  const displayDesc = (v: Venue) => {
    const d = (v.venueDescription && v.venueDescription.trim()) || (v.description && v.description.trim())
    return d || "No description available"
  }

  const displayAddress = (v: Venue) => {
    const a = (v.venueAddress && v.venueAddress.trim()) || (v.address && v.address.trim())
    return a || "Address not provided"
  }

  const displayCapacity = (v: Venue) => (v.maxCapacity && v.maxCapacity > 0 ? v.maxCapacity : "N/A")

  const displayHalls = (v: Venue) => (v.totalHalls && v.totalHalls > 0 ? v.totalHalls : "N/A")

  // Improved filtering logic - now only filters locally without API calls
  const filteredVenues = Array.isArray(venues)
    ? venues.filter((venue) => {
        const name = displayName(venue)
        const addr = displayAddress(venue)
        const extractedCity = extractCityFromAddress(addr)
        
        const matchesSearch =
          searchQuery === "" ||
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          addr.toLowerCase().includes(searchQuery.toLowerCase())

        // Improved city matching - check if extracted city matches selected cities
        const matchesCity =
          selectedCities.length === 0 || 
          selectedCities.some((selectedCity) => 
            extractedCity.toLowerCase() === selectedCity.toLowerCase() ||
            addr.toLowerCase().includes(selectedCity.toLowerCase())
          )

        // Country matching
        const matchesCountry =
          selectedCountries.length === 0 ||
          selectedCountries.some((country) => 
            addr.toLowerCase().includes(country.toLowerCase())
          )

        return matchesSearch && matchesCity && matchesCountry
      })
    : []

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading venues...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchVenues}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Perfect Venues</h1>
              <p className="text-gray-600 mt-1">Discover amazing venues for your next event</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Discover Venues</h2>

              {/* Search Input */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Popular Cities */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Popular cities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCityFilter(city)}
                      className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                        selectedCities.includes(city) ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
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
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {popularCountries.map((country, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCountryFilter(country.name)}
                      className={`flex items-center text-left text-sm py-2 px-3 rounded-md transition-colors ${
                        selectedCountries.includes(country.name)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </button>
                  ))}
                </div>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Browse All Countries
                </Button>
              </div>

              {/* Collections */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Collections</h3>
                <div className="space-y-2 mb-4">
                  {collections.map((collection) => {
                    const IconComponent = collection.icon
                    return (
                      <button
                        key={collection.name}
                        onClick={() => toggleCollectionFilter(collection.name)}
                        className={`flex items-center w-full text-left text-sm py-3 px-3 rounded-md transition-colors ${
                          selectedCollections.includes(collection.name)
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-3" />
                        {collection.name}
                      </button>
                    )
                  })}
                </div>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  All Category
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{filteredVenues.length} venues found</h2>
                <p className="text-gray-600">Best venues for your events</p>
              </div>
              {/* <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Capacity</option>
                </select>
              </div> */}
            </div>

            {/* Venues Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVenues.map((venue, index) => (
                <div
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group rounded-sm border cursor-pointer"
                  onClick={() => handleVenueClick(venue.id)}
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={venue.logo && venue.logo.trim() !== "" ? venue.logo : "/city/c2.jpg"}
                      alt={venue.venueName || "Venue"}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.currentTarget.src = "/city/c2.jpg")}
                    />

                    {venue.isVerified && (
                      <div className="absolute top-3 left-3">
                        {/* <Badge className="bg-orange-500 text-white">Featured</Badge> */}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-5">
                    {/* Venue Name & Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{displayName(venue)}</h3>

                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{venue.averageRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-sm text-gray-500">({venue.totalReviews || 0})</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{displayDesc(venue)}</p>

                    {/* Address */}
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{displayAddress(venue)}</span>
                    </div>

                    {/* Capacity & Halls */}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Capacity: {displayCapacity(venue)}</p>
                      <p>Total Halls: {displayHalls(venue)}</p>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredVenues.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedCities.length > 0 || selectedCountries.length > 0
                      ? "Try adjusting your search criteria or browse all available venues."
                      : "No venues are currently available in the database."}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCities([])
                      setSelectedCountries([])
                      setSelectedCollections([])
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}