"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Star,
  Share2,
  Heart,
  Award,
  Building,
  CheckCircle,
  ExternalLink,
  Package,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { getAllEvents } from "@/lib/data/events"
import { useParams, useRouter } from "next/navigation"

export default function ExhibitorPage() {
  const params = useParams()
  const router = useRouter()
  const exhibitorId = params.id as string

  const [activeTab, setActiveTab] = useState("overview")
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 6

  // Get all events and filter by exhibitor participation
  const allEvents = getAllEvents()
  const exhibitorEvents = allEvents.filter((event) =>
    event.exhibitors?.some((exhibitor) => exhibitor.id === exhibitorId),
  )

  // Mock exhibitor data (in real app, this would come from API)
  const exhibitorDetails = {
    id: exhibitorId,
    name: "TechCorp Solutions",
    logo: "/placeholder.svg?height=120&width=120&text=TC",
    description:
      "Leading technology solutions provider specializing in enterprise software and AI-powered applications for businesses worldwide.",
    founded: "2015",
    headquarters: "Bangalore, India",
    website: "https://techcorp.com",
    phone: "+91 98765 43210",
    email: "info@techcorp.com",
    industry: "Technology",
    companySize: "201-500 employees",
    specialties: ["Enterprise Software", "AI/ML Solutions", "Cloud Computing", "Data Analytics"],
    certifications: ["ISO 27001:2013", "SOC 2 Type II", "GDPR Compliant", "Microsoft Gold Partner"],
    achievements: [
      "Best Tech Innovation Award 2023",
      "Top 50 Startups in India 2022",
      "Excellence in Customer Service",
      "Sustainability Leader Recognition",
    ],
    products: [
      {
        id: "1",
        name: "Enterprise AI Platform",
        description: "Complete AI solution for enterprise automation",
        image: "/placeholder.svg?height=200&width=300&text=AI",
        category: "Software",
        price: "Contact for pricing",
      },
      {
        id: "2",
        name: "Cloud Analytics Suite",
        description: "Advanced analytics and reporting platform",
        image: "/placeholder.svg?height=200&width=300&text=Analytics",
        category: "Software",
        price: "Starting at $999/month",
      },
      {
        id: "3",
        name: "Smart IoT Gateway",
        description: "Industrial IoT connectivity solution",
        image: "/placeholder.svg?height=200&width=300&text=IoT",
        category: "Hardware",
        price: "$2,499",
      },
    ],
    Events: [
      {
        id: "1",
        name: "Enterprise AI Platform",
        description: "Complete AI solution for enterprise automation",
        image: "/placeholder.svg?height=200&width=300&text=AI",
        category: "Software",
        price: "Contact for pricing",
      },
    ],
    socialProof: {
      clientsServed: "500+",
      projectsCompleted: "1,200+",
      yearsExperience: "8+",
      teamSize: "150+",
    },
  }

  // Calculate exhibitor statistics
  const stats = useMemo(() => {
    const totalEvents = exhibitorEvents.length
    const upcomingEvents = exhibitorEvents.filter((event) => event.status === "upcoming").length
    const completedEvents = exhibitorEvents.filter((event) => event.status === "completed").length
    const avgRating =
      exhibitorEvents.length > 0
        ? exhibitorEvents.reduce((sum, event) => sum + event.rating.average, 0) / exhibitorEvents.length
        : 4.8

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      avgRating: Math.round(avgRating * 10) / 10,
      totalProducts: exhibitorDetails.products.length,
      clientsServed: exhibitorDetails.socialProof.clientsServed,
    }
  }, [exhibitorEvents])

  // Pagination for events
  const totalPages = Math.ceil(exhibitorEvents.length / eventsPerPage)
  const paginatedEvents = exhibitorEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#002C71] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Exhibitor Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={exhibitorDetails.logo || "/placeholder.svg"} alt={exhibitorDetails.name} />
                <AvatarFallback className="text-2xl font-bold bg-white text-blue-600">
                  {exhibitorDetails.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Exhibitor Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{exhibitorDetails.name}</h1>
                <Badge className="bg-yellow-500 text-yellow-900">Verified</Badge>
                <Badge className="bg-green-500 text-white">Premium</Badge>
              </div>
              <p className="text-xl text-blue-100 mb-4">{exhibitorDetails.description}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{exhibitorDetails.headquarters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{exhibitorDetails.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{exhibitorDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={exhibitorDetails.website} className="hover:text-white transition-colors">
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
              <div className="text-sm text-gray-600">Events Participated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.clientsServed}</div>
              <div className="text-sm text-gray-600">Clients Served</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">{stats.avgRating}</span>
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{exhibitorDetails.socialProof.yearsExperience}</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{exhibitorDetails.founded}</div>
              <div className="text-sm text-gray-600">Founded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products ({stats.totalProducts})</TabsTrigger>
            <TabsTrigger value="events">Events ({stats.totalEvents})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Highlights */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      About {exhibitorDetails.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{exhibitorDetails.description}</p>
                  </CardContent>
                </Card>

                {/* Featured Products */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Featured Products
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exhibitorDetails.products.slice(0, 2).map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                          <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm font-medium text-blue-600">{product.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => setActiveTab("products")}>
                        View All Products
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Event Participation</h3>
                    <div className="space-y-4">
                      {exhibitorEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={event.images[0]?.url || "/placeholder.svg"}
                            alt={event.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(event.timings.startDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{event.rating.average}</span>
                            </div>
                            <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => setActiveTab("events")}>
                        View All Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Key Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clients Served</span>
                        <span className="font-semibold">{exhibitorDetails.socialProof.clientsServed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects Completed</span>
                        <span className="font-semibold">{exhibitorDetails.socialProof.projectsCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="font-semibold">{exhibitorDetails.socialProof.teamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Size</span>
                        <span className="font-semibold">{exhibitorDetails.companySize}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {exhibitorDetails.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </h3>
                    <div className="space-y-2">
                      {exhibitorDetails.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {exhibitorDetails.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Products & Solutions</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{exhibitorDetails.products.length} products available</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitorDetails.products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-500 text-white">{product.category}</Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{product.price}</span>
                        <Button size="sm">Learn More</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Event Participation History</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Participated in {exhibitorEvents.length} events</span>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={event.images[0]?.url || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {event.featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">Featured</Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h4>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.timings.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location.city}, {event.location.venue}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{event.rating.average}</span>
                          <span className="text-sm text-gray-500">({event.rating.count})</span>
                        </div>
                        <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
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
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Founded</label>
                      <p className="text-gray-900">{exhibitorDetails.founded}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Headquarters</label>
                      <p className="text-gray-900">{exhibitorDetails.headquarters}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{exhibitorDetails.industry}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Size</label>
                      <p className="text-gray-900">{exhibitorDetails.companySize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <a
                        href={exhibitorDetails.website}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {exhibitorDetails.website}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <div className="space-y-1">
                        <p className="text-gray-900">{exhibitorDetails.phone}</p>
                        <p className="text-gray-900">{exhibitorDetails.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Business Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Events Participated</span>
                      <span className="font-semibold">{stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products Offered</span>
                      <span className="font-semibold">{stats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clients Served</span>
                      <span className="font-semibold">{exhibitorDetails.socialProof.clientsServed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed</span>
                      <span className="font-semibold">{exhibitorDetails.socialProof.projectsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Years of Experience</span>
                      <span className="font-semibold">{exhibitorDetails.socialProof.yearsExperience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{stats.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Full Description</h3>
                <p className="text-gray-600 leading-relaxed">{exhibitorDetails.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Reviews Coming Soon</h3>
              <p className="text-gray-600">We're working on adding customer reviews and ratings for exhibitors.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
