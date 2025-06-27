"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Mail, MapPin, Clock, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react"
import { getEventById } from "@/lib/data/events"
import { notFound } from "next/navigation"
import EventHero from "@/components/event-hero"
import { useState } from "react"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = getEventById(id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!event) {
    notFound()
  }

  const mainImage = event.images.find((img) => img.type === "main")
  const galleryImages = event.images.filter((img) => img.type === "gallery")
  const allImages = [mainImage, ...galleryImages].filter(Boolean)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventHero event={event} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="about" className="w-full">
              {/* Enhanced Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                <TabsList className="grid w-full grid-cols-8 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="exhibitors"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Exhibitors
                  </TabsTrigger>
                  <TabsTrigger
                    value="space-cost"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Space Cost
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none border-r border-gray-200 py-3 px-4 text-sm font-medium"
                  >
                    Organizer
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Review
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-6">
                {/* Enhanced Image Gallery with Carousel */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="relative">
                    {/* Main Image Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                      {allImages.slice(currentImageIndex, currentImageIndex + 3).map((image, index) => (
                        <div key={image?.id || index} className="relative group overflow-hidden rounded-lg">
                          <Image
                            src={image?.url || "/placeholder.svg?height=200&width=300&text=Event+Image"}
                            alt={image?.alt || "Event image"}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    {allImages.length > 3 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}

                    {/* Pagination Dots */}
                    <div className="flex justify-center space-x-2 pb-4">
                      {Array.from({ length: Math.ceil(allImages.length / 3) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index * 3)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            Math.floor(currentImageIndex / 3) === index
                              ? "bg-blue-600"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      About the Event
                      <Badge variant="secondary" className="text-xs">
                        {event.categories.join(", ")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg">Event Highlights:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {event.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Listed In Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Listed In</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Automation",
                        "PrecisionEngineering",
                        "IndustrialAutomation",
                        "SmartManufacturing",
                        "Robotics",
                        "ProcessAutomation",
                        "DigitalManufacturing",
                        "PrecisionTechnology",
                        "AutomationTechnology",
                        "AdvancedManufacturing",
                        "CNCPrecision",
                        "MotionControl",
                        "Mechatronics",
                        "PLCProgramming",
                        "FactoryAutomation",
                        "SensorTechnology",
                        "RoboticAutomation",
                        "IndustrialRobotics",
                        "AutomationSolutions",
                        "AccuracyMatters",
                      ].map((tag) => (
                        <button
                          key={tag}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Exhibitor Profile Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Exhibitor Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "CNC Machines (Turning, Milling, Grinding, Drilling, Boring, etc.)",
                        "Laser Cutting & Water Jet Cutting Machines",
                        "EDM, Wire Cut, and Electrochemical Machining",
                        "High-Speed Machining Centers & Multi-Axis Machines",
                        "Industrial Robots & Collaborative Robots (Cobots)",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Timings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Duration:</span>
                        <span className="font-semibold">{event.stats.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Hours:</span>
                        <span className="font-semibold">
                          {event.timings.dailyStart} - {event.timings.dailyEnd}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-semibold">{event.timings.timezone}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        Entry Fee
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">General Entry:</span>
                        <span className="font-semibold text-green-600">
                          {event.pricing.currency}
                          {event.pricing.general.toLocaleString()}
                        </span>
                      </div>
                      {event.pricing.student && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Student:</span>
                          <span className="font-semibold text-blue-600">
                            {event.pricing.currency}
                            {event.pricing.student.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {event.pricing.vip && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">VIP:</span>
                          <span className="font-semibold text-purple-600">
                            {event.pricing.currency}
                            {event.pricing.vip.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Dress Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.dressCode}</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Age Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.ageLimit}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Venue Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Map & Directions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                        <p className="text-gray-700 font-medium">Interactive Map</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.location.venue}, {event.location.city}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{event.location.address}</p>
                        <Button className="mt-3" size="sm">
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exhibitors">
                <Card>
                  <CardHeader>
                    <CardTitle>All Exhibitors ({event.featuredExhibitors.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.featuredExhibitors.map((exhibitor) => (
                        <div
                          key={exhibitor.id}
                          className="flex gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <Image
                            src={exhibitor.image || "/placeholder.svg"}
                            alt={exhibitor.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{exhibitor.name}</h4>
                            <p className="text-xs text-gray-600">{exhibitor.description}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{exhibitor.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="space-cost">
                <Card>
                  <CardHeader>
                    <CardTitle>Exhibit Space Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.exhibitSpaceCosts.map((cost, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border"
                      >
                        <div>
                          <span className="font-medium">{cost.type}</span>
                          <p className="text-sm text-gray-600">{cost.description}</p>
                          <p className="text-xs text-gray-500">Minimum area: {cost.minArea} sq.m</p>
                        </div>
                        <span className="font-bold text-lg text-blue-600">
                          {event.pricing.currency}
                          {cost.pricePerSqm.toLocaleString()}/sq.m
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Floor plan will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="venue">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{event.location.venue}</h4>
                        <p className="text-gray-600">{event.location.address}</p>
                        <p className="text-gray-600">{event.location.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="speakers">
                <Card>
                  <CardHeader>
                    <CardTitle>Speakers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Speaker information will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organizer">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">
                          {event.organizer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{event.organizer.name}</h4>
                        <p className="text-gray-600 mb-3">{event.organizer.description}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span>{event.organizer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span>{event.organizer.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews ({event.rating.count})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-xl">{event.rating.average}</span>
                      </div>
                      <span className="text-gray-600">out of 5 stars</span>
                    </div>
                    <p className="text-gray-600">Event reviews will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Featured Items */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Featured Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.featuredItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  View All Items
                </Button>
              </CardContent>
            </Card>

            {/* Featured Exhibitors */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Featured Exhibitors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.featuredExhibitors.slice(0, 3).map((exhibitor) => (
                  <div key={exhibitor.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image
                      src={exhibitor.image || "/placeholder.svg"}
                      alt={exhibitor.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{exhibitor.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{exhibitor.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {exhibitor.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{exhibitor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  View All Exhibitors
                </Button>
              </CardContent>
            </Card>

            {/* Places to Visit */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Places to Visit in {event.location.city}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.touristAttractions.map((attraction) => (
                  <div key={attraction.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Image
                      src={attraction.image || "/placeholder.svg"}
                      alt={attraction.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{attraction.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{attraction.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {attraction.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{attraction.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  Explore {event.location.city}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
