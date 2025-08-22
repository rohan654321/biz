"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Shield,
  Camera,
  Phone,
  Mail,
  Globe,
  Clock,
  Building2,
  Users2,
  Utensils,
  Trophy,
  Music,
} from "lucide-react"
import { getAllVenues } from "@/lib/data/events"

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])

  // Mock venues data
  const venues = getAllVenues() ;

const popularCities = [
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Gurgaon",
  "Noida",
  "Mumbai",
]


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
  { name: "South Africa", flag: "🇿🇦" }
]


  const collections = [
    { name: "Hotels & Resorts", icon: Building2 },
    { name: "Conference Centres", icon: Users2 },
    { name: "Banquets & Halls", icon: Utensils },
    { name: "Exhibition & Convention Centres", icon: Building2 },
    { name: "Sports Complexes", icon: Trophy },
    { name: "Auditoriums", icon: Music },
  ]

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

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.address.toLowerCase().includes(searchQuery.toLowerCase()) 
      // venue.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCity = selectedCities.length === 0 || selectedCities.includes(venue.location.city)
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(venue.location.country)
    // const matchesCollection = selectedCollections.length === 0 || selectedCollections.includes(venue..collection)

    return matchesSearch && matchesCity && matchesCountry 
  })

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
            {/* <div className="flex items-center space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700">List Your Venue</Button>
            </div> */}
          </div>

          {/* Search Bar
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search venues by name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Discover Venues</h2>

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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Capacity</option>
                </select>
              </div>
            </div>

            {/* Venues Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <div key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group rounded-sm border-1">
                  <div className="relative">
                    <img
                      src={venue.images[0] || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      {venue.isVerified && <Badge className="bg-orange-500 text-white">Featured</Badge>}
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white p-2">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white p-2">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      {/* <Badge
                        className={`${
                          venue.availability === "Available" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {venue.availability[0]}
                      </Badge> */}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{venue.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{venue.rating.average}</span>
                        <span className="text-sm text-gray-500">({venue.reviews.length})</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{venue.location.address}</span>
                    </div>

                  
                  </CardContent>
                </div>
              ))}
            </div>

            {/* Load More */}
            {filteredVenues.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="bg-transparent">
                  Load More Venues
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredVenues.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No venues found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or browse all available venues.
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
