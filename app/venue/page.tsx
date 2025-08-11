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

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])

  // Mock venues data
  const venues = [
    {
      id: 1,
      name: "Grand Convention Center",
      location: "Mumbai, Maharashtra",
      country: "India",
      city: "Mumbai",
      address: "123 Business District, Mumbai",
      capacity: "5000 people",
      type: "Convention Center",
      collection: "Exhibition & Convention Centres",
      rating: 4.8,
      reviews: 156,
      price: "₹50,000",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Hall+1",
        "/placeholder.svg?height=200&width=300&text=Hall+2",
        "/placeholder.svg?height=200&width=300&text=Hall+3",
      ],
      amenities: ["wifi", "parking", "catering", "security", "av"],
      description:
        "Premier convention center with state-of-the-art facilities and multiple halls for large-scale events.",
      contact: {
        phone: "+91 98765 43210",
        email: "info@grandconvention.com",
        website: "www.grandconvention.com",
      },
      availability: "Available",
      featured: true,
      totalHalls: 8,
      established: "2015",
    },
    {
      id: 2,
      name: "Royal Banquet Hall",
      location: "Delhi, India",
      country: "India",
      city: "Delhi",
      address: "456 Central Delhi, New Delhi",
      capacity: "800 people",
      type: "Banquet Hall",
      collection: "Banquets & Halls",
      rating: 4.6,
      reviews: 89,
      price: "₹25,000",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Banquet+1",
        "/placeholder.svg?height=200&width=300&text=Banquet+2",
      ],
      amenities: ["wifi", "parking", "catering", "av"],
      description: "Elegant banquet hall perfect for weddings, corporate events, and celebrations.",
      contact: {
        phone: "+91 87654 32109",
        email: "bookings@royalbanquet.com",
        website: "www.royalbanquet.com",
      },
      availability: "Available",
      featured: false,
      totalHalls: 3,
      established: "2018",
    },
    {
      id: 3,
      name: "Tech Hub Conference Center",
      location: "London, United Kingdom",
      country: "United Kingdom",
      city: "London",
      address: "789 Tech District, London",
      capacity: "1200 people",
      type: "Conference Center",
      collection: "Conference Centres",
      rating: 4.7,
      reviews: 234,
      price: "£450",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Conference+1",
        "/placeholder.svg?height=200&width=300&text=Conference+2",
        "/placeholder.svg?height=200&width=300&text=Conference+3",
      ],
      amenities: ["wifi", "parking", "catering", "security", "av"],
      description: "Modern conference center equipped with latest technology for corporate events and seminars.",
      contact: {
        phone: "+44 20 7946 0958",
        email: "events@techhub.com",
        website: "www.techhub.com",
      },
      availability: "Booked",
      featured: true,
      totalHalls: 5,
      established: "2020",
    },
    {
      id: 4,
      name: "Heritage Palace Hotel",
      location: "New York, United States",
      country: "United States",
      city: "New York",
      address: "321 Heritage Lane, Manhattan",
      capacity: "2000 people",
      type: "Hotel Venue",
      collection: "Hotels & Resorts",
      rating: 4.9,
      reviews: 67,
      price: "$850",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Palace+1",
        "/placeholder.svg?height=200&width=300&text=Palace+2",
      ],
      amenities: ["wifi", "parking", "catering", "security"],
      description: "Magnificent heritage hotel venue perfect for luxury weddings and premium events.",
      contact: {
        phone: "+1 212 555 0123",
        email: "reservations@heritagepalace.com",
        website: "www.heritagepalace.com",
      },
      availability: "Available",
      featured: false,
      totalHalls: 6,
      established: "1995",
    },
    {
      id: 5,
      name: "Olympic Sports Complex",
      location: "Sydney, Australia",
      country: "Australia",
      city: "Sydney",
      address: "555 Olympic Park, Sydney",
      capacity: "15000 people",
      type: "Sports Complex",
      collection: "Sports Complexes",
      rating: 4.5,
      reviews: 123,
      price: "AU$1200",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Stadium+1",
        "/placeholder.svg?height=200&width=300&text=Stadium+2",
        "/placeholder.svg?height=200&width=300&text=Stadium+3",
      ],
      amenities: ["wifi", "parking", "catering", "security", "av"],
      description: "World-class sports complex perfect for large sporting events and concerts.",
      contact: {
        phone: "+61 2 9876 5432",
        email: "events@olympiccomplex.com",
        website: "www.olympiccomplex.com",
      },
      availability: "Available",
      featured: true,
      totalHalls: 4,
      established: "2000",
    },
    {
      id: 6,
      name: "Grand Auditorium",
      location: "Toronto, Canada",
      country: "Canada",
      city: "Toronto",
      address: "888 Arts District, Toronto",
      capacity: "3000 people",
      type: "Auditorium",
      collection: "Auditoriums",
      rating: 4.4,
      reviews: 78,
      price: "CA$600",
      priceUnit: "per day",
      image: "/images/gpex.jpg",
      images: [
        "/placeholder.svg?height=200&width=300&text=Auditorium+1",
        "/placeholder.svg?height=200&width=300&text=Auditorium+2",
      ],
      amenities: ["wifi", "parking", "av"],
      description: "Prestigious auditorium perfect for concerts, theater performances, and large presentations.",
      contact: {
        phone: "+1 416 555 0987",
        email: "info@grandauditorium.com",
        website: "www.grandauditorium.com",
      },
      availability: "Available",
      featured: false,
      totalHalls: 2,
      established: "2010",
    },
  ]

const popularCities = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Dubai",
  "Singapore",
  "Rome"
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
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCity = selectedCities.length === 0 || selectedCities.includes(venue.city)
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(venue.country)
    const matchesCollection = selectedCollections.length === 0 || selectedCollections.includes(venue.collection)

    return matchesSearch && matchesCity && matchesCountry && matchesCollection
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
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      {venue.featured && <Badge className="bg-orange-500 text-white">Featured</Badge>}
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
                      <Badge
                        className={`${
                          venue.availability === "Available" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {venue.availability}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{venue.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                        <span className="text-sm text-gray-500">({venue.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{venue.location}</span>
                    </div>

                    {/* <div className="flex items-center text-gray-600 mb-3">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">Up to {venue.capacity}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-sm">{venue.type}</span>
                    </div>   */}

                    {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">{venue.description}</p> */}

                    {/* Amenities */}
                    {/* <div className="flex flex-wrap gap-2 mb-4">
                      {venue.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                          {getAmenityIcon(amenity)}
                          <span className="text-xs text-gray-700">{getAmenityLabel(amenity)}</span>
                        </div>
                      ))}
                      {venue.amenities.length > 4 && (
                        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                          <span className="text-xs text-gray-700">+{venue.amenities.length - 4} more</span>
                        </div>
                      )}
                    </div> */}

                    {/* Price and Action */}
                    {/* <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">{venue.price}</span>
                        <span className="text-sm text-gray-600 ml-1">{venue.priceUnit}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Book Now
                        </Button>
                      </div>
                    </div> */}

                    {/* Contact Info */}
                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>Call</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            <span>Email</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            <span>Website</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Est. {venue.established}</span>
                        </div>
                      </div>
                    </div> */}
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
