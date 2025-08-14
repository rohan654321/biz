"use client"

import { useState, useMemo } from "react"
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Phone,
  Mail,
  Globe,
  Filter,
  Heart,
  Share2,
  Award,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Mock organizer data
const organizers = [
  {
    id: 1,
    name: "EventPro Solutions",
    company: "EventPro Solutions Ltd.",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviewCount: 156,
    location: "Mumbai, India",
    country: "India",
    category: "Corporate Events",
    eventsOrganized: 245,
    yearsExperience: 8,
    specialties: ["Corporate Conferences", "Product Launches", "Team Building"],
    description:
      "Leading corporate event management company specializing in large-scale conferences and product launches.",
    phone: "+91 98765 43210",
    email: "contact@eventpro.com",
    website: "www.eventpro.com",
    verified: true,
    featured: true,
    totalAttendees: "50K+",
    successRate: 98,
    nextAvailable: "2024-02-15",
  },
  {
    id: 2,
    name: "Celebration Masters",
    company: "Celebration Masters Inc.",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviewCount: 203,
    location: "Delhi, India",
    country: "India",
    category: "Weddings",
    eventsOrganized: 189,
    yearsExperience: 12,
    specialties: ["Destination Weddings", "Traditional Ceremonies", "Reception Planning"],
    description: "Premium wedding planners creating unforgettable moments with attention to every detail.",
    phone: "+91 98765 43211",
    email: "info@celebrationmasters.com",
    website: "www.celebrationmasters.com",
    verified: true,
    featured: false,
    totalAttendees: "35K+",
    successRate: 96,
    nextAvailable: "2024-02-20",
  },
  {
    id: 3,
    name: "TechConf Organizers",
    company: "TechConf Global",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviewCount: 89,
    location: "Bangalore, India",
    country: "India",
    category: "Technology",
    eventsOrganized: 67,
    yearsExperience: 5,
    specialties: ["Tech Conferences", "Startup Events", "Innovation Summits"],
    description: "Specialized in organizing cutting-edge technology conferences and startup events.",
    phone: "+91 98765 43212",
    email: "hello@techconf.com",
    website: "www.techconf.com",
    verified: true,
    featured: true,
    totalAttendees: "25K+",
    successRate: 94,
    nextAvailable: "2024-02-18",
  },
  {
    id: 4,
    name: "Global Events USA",
    company: "Global Events LLC",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviewCount: 312,
    location: "New York, USA",
    country: "United States",
    category: "International",
    eventsOrganized: 456,
    yearsExperience: 15,
    specialties: ["International Conferences", "Trade Shows", "Corporate Summits"],
    description: "Premier international event management company with global reach and expertise.",
    phone: "+1 555-123-4567",
    email: "contact@globaleventsusa.com",
    website: "www.globaleventsusa.com",
    verified: true,
    featured: true,
    totalAttendees: "100K+",
    successRate: 99,
    nextAvailable: "2024-02-12",
  },
  {
    id: 5,
    name: "London Event Co.",
    company: "London Event Company Ltd.",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviewCount: 178,
    location: "London, UK",
    country: "United Kingdom",
    category: "Corporate Events",
    eventsOrganized: 234,
    yearsExperience: 10,
    specialties: ["Business Conferences", "Networking Events", "Award Ceremonies"],
    description: "Established London-based event organizers specializing in corporate and business events.",
    phone: "+44 20 7123 4567",
    email: "info@londoneventco.com",
    website: "www.londoneventco.com",
    verified: true,
    featured: false,
    totalAttendees: "45K+",
    successRate: 95,
    nextAvailable: "2024-02-25",
  },
  {
    id: 6,
    name: "Sydney Celebrations",
    company: "Sydney Celebrations Pty Ltd",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviewCount: 145,
    location: "Sydney, Australia",
    country: "Australia",
    category: "Social Events",
    eventsOrganized: 167,
    yearsExperience: 7,
    specialties: ["Social Gatherings", "Cultural Events", "Community Festivals"],
    description: "Creative event organizers bringing communities together through memorable celebrations.",
    phone: "+61 2 9123 4567",
    email: "hello@sydneycelebrations.com",
    website: "www.sydneycelebrations.com",
    verified: true,
    featured: false,
    totalAttendees: "30K+",
    successRate: 93,
    nextAvailable: "2024-03-01",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("rating")

  const filteredOrganizers = useMemo(() => {
    const filtered = organizers.filter((organizer) => {
      const matchesSearch =
        organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCity =
        selectedCities.length === 0 || selectedCities.some((city) => organizer.location.includes(city))

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
          return b.yearsExperience - a.yearsExperience
        case "events":
          return b.eventsOrganized - a.eventsOrganized
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCities, selectedCountries, selectedCategories, sortBy])

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
          <div className="bg-white border-y border-gray-200  px-8 py-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Expert Organizers</h1>
                <p className="text-gray-600">Connect with professional event organizers for your next event</p>
              </div>
              {/* <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Become an Organizer</Button>
              </div> */}
            </div>

            {/* Search and Sort */}
            {/* <div className="flex gap-4 items-center">
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
            </div> */}

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
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={organizer.image || "/placeholder.svg"}
                        alt={organizer.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                        {/* {organizer.featured && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">Featured</Badge>
                      )} */}
                      {organizer.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {/* <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div> */}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{organizer.name}</h3>
                          <p className="text-sm text-gray-600">{organizer.company}</p>
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
                          <span>{organizer.yearsExperience} years</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{organizer.eventsOrganized} events</span>
                        </div>
                      </div>
{/* 
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
                      </div> */}
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
