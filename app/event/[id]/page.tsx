import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Phone, Mail, MapPin, Clock, IndianRupee } from "lucide-react"
import { getEventById } from "@/lib/data/events"
import { notFound } from "next/navigation"
import EventHero from "@/components/event-hero"
import EventImageGallery from "@/components/event-image-gallery"
import { Plus } from "lucide-react"
import { Share2 } from "lucide-react"
import { Bookmark } from "lucide-react"

interface EventPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = getEventById(id)

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const followers = Array(6).fill({
    name: "Ramesh S",
    company: "Mobile Technology",
    location: "Chennai, India",
    imageUrl: "/placeholder.svg?height=80&width=80&text=Profile",
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <EventHero event={event} />
       
       {/* Event Details Section */}
      <div className=" max-w-6xl mx-auto py-4">
        <div className="bg-white rounded-lg  p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Event Title and Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Global Precision Expo 2025</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>Chennai Trade Centre, Chennai - India</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Get Directions
                </Button>
                                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">4.5</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pr-4 lg:pr-4">
              <p className="text-center text-gray-700 font-medium">Interested in this Event ?</p>
              <div className="flex gap-3 ">
                <Button variant="outline" className="flex-1 border-gray-300 bg-transparent">
                  Visit
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 ">
                  Exhibit</Button>
              </div>
              {/* <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Get Directions
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div> */}
            </div>
          </div>
        </div>
       </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="about" className="w-full">
              {/* Enhanced Tab Navigation */}
              <div className="bg-white rounded-lg mb-6 shadow-sm border border-gray-200">
                <TabsList className="grid w-full grid-cols-8 h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="exhibitors"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Exhibitors
                  </TabsTrigger>
                  <TabsTrigger
                    value="space-cost"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none py-3 px-4 text-sm font-medium"
                  >
                    Space Cost
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Layout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="venue"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Venue
                  </TabsTrigger>
                  <TabsTrigger
                    value="speakers"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
                  >
                    Speakers
                  </TabsTrigger>
                  <TabsTrigger
                    value="organizer"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-none  py-3 px-4 text-sm font-medium"
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
                <EventImageGallery images={event.images} />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Timings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Duration:</span>
                        <span className="font-semibold text-blue-600">{event.stats.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Hours:</span>
                        <span className="font-semibold text-blue-600">
                          {event.timings.dailyStart} - {event.timings.dailyEnd}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-semibold text-blue-600">{event.timings.timezone}</span>
                      </div>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        Entry Fee
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">General Entry:</span>
                        <span className="font-semibold text-blue-600">
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
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle>Dress Code</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-700">{event.dressCode}</p>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border-2 rounded-lg pb-4">
                    <CardHeader className="bg-blue-100 rounded-t-lg p-4">
                      <CardTitle>Age Limit</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-700">{event.ageLimit}</p>
                    </CardContent>
                  </div>
                </div>

                {/* Organizer Section */}
                <Card className="border border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900 text-base">Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 flex items-center justify-center">
                        <Image
                          src="/placeholder.svg?height=96&width=96&text=Organizer"
                          alt="Organizer Logo"
                          width={96}
                          height={96}
                          className="object-contain rounded shadow-sm"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-900 text-sm">{event.organizer.name}</h3>
                          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                            Top Rated
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{event.organizer.description}</p>
                        <p className="text-sm text-blue-900 mt-1">1 Upcoming Events • {event.followers} Followers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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

                {/* Exhibitor List */}
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Exhibitor List</h2>
                  <p className="text-sm text-gray-500 mb-6">68 Exhibitor of Current Edition</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followers.map((follower, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-center mb-4">
                            <div className="w-16 h-16 flex justify-center">
                              <Image
                                src={follower.imageUrl || "/placeholder.svg"}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="object-contain shadow-sm rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <button className="px-3 py-1 text-red-600 text-sm border-2 border-red-600 rounded-md hover:bg-red-50 transition">
                                +Follow
                              </button>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-700 mb-3">{follower.company}</p>
                          <button className="w-full border-2 border-red-600 text-white bg-red-600 text-sm py-2 rounded-full font-semibold hover:bg-red-700 transition">
                            Schedule Meeting
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg">
                      View All Exhibitors
                    </Button>
                  </div>
                </div>

                {/* Followers Section */}
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Followers</h2>
                  <p className="text-sm text-gray-500 mb-6">{event.followers} Followers</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followers.map((follower, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-center mb-4">
                            <div className="w-16 h-16 flex justify-center">
                              <Image
                                src={follower.imageUrl || "/placeholder.svg"}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="object-contain shadow-sm rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-blue-900 text-sm">{follower.name}</h3>
                              <p className="text-xs text-gray-700">{follower.company}</p>
                              <p className="text-xs text-gray-700">{follower.location}</p>
                            </div>
                          </div>
                          <button className="w-full border-2 border-red-600 text-red-600 text-sm py-1 rounded-full font-semibold hover:bg-red-50 transition">
                            Connect
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-2">
                    <p className="font-semibold">Write a Review</p>
                    <input
                      type="text"
                      placeholder="Help other visitors by sharing your review"
                      className="w-full border p-2 rounded"
                    />
                    <Button className="bg-red-500 hover:bg-red-600 text-white">Add Your Review</Button>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <p className="font-semibold">User Rating</p>
                    <div className="text-blue-800 font-bold text-lg flex items-center gap-2">
                      {event.rating.average} <Star className="w-4 h-4 fill-red-500 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.rating.count} Rating
                      <br />
                      27 Reviews
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-lg mb-2">User Reviews</p>

                    <div className="border rounded-lg p-4 mb-4 space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            R
                          </div>
                          <div>
                            <p className="font-semibold">Ramesh S</p>
                            <p className="text-xs text-gray-500">
                              Vice President at Mobile Technology
                              <br />
                              Chennai, India
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center font-bold text-blue-800">
                          4.4 <Star className="w-4 h-4 fill-red-500 text-red-500 ml-1" />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            R
                          </div>
                          <div>
                            <p className="font-semibold">Ramesh S</p>
                            <p className="text-xs text-gray-500">
                              Vice President at Mobile Technology
                              <br />
                              Chennai, India
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center font-bold text-blue-800">
                          5 <Star className="w-4 h-4 fill-red-500 text-red-500 ml-1" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget
                        Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event
                        attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global
                        reach of the fashion and apparel industry...
                        <span className="text-red-500 font-semibold cursor-pointer"> Read More</span>
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline">Prev</Button>
                      <Button variant="outline">Next</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="exhibitors">
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Exhibitor List</h2>
                  <p className="text-sm text-gray-500 mb-6">68 Exhibitor of Current Edition</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followers.map((follower, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-center mb-4">
                            <div className="w-16 h-16 flex justify-center">
                              <Image
                                src={follower.imageUrl || "/placeholder.svg"}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="object-contain shadow-sm rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <button className="px-3 py-1 text-red-600 text-sm border-2 border-red-600 rounded-md hover:bg-red-50 transition">
                                +Follow
                              </button>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-700 mb-3">{follower.company}</p>
                          <button className="w-full border-2 border-red-600 text-white bg-red-600 text-sm py-2 rounded-full font-semibold hover:bg-red-700 transition">
                            Schedule Meeting
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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
                <div className="py-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Speaker List</h2>
                  <p className="text-sm text-gray-500 mb-6">68 speakers of Current Edition</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {followers.map((follower, index) => (
                      <Card key={index} className="border">
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-center mb-4">
                            <div className="w-16 h-16 flex justify-center">
                              <Image
                                src={follower.imageUrl || "/placeholder.svg"}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="object-contain shadow-sm rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <button className="px-3 py-1 text-red-600 text-sm border-2 border-red-600 rounded-md hover:bg-red-50 transition">
                                +Follow
                              </button>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-700 mb-3">{follower.company}</p>
                          <button className="w-full border-2 border-red-600 text-white bg-red-600 text-sm py-2 rounded-full font-semibold hover:bg-red-700 transition">
                            Schedule Meeting
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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
            <Card className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-blue-800 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Featured Hotels</CardTitle>
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
              </CardContent>
            </Card>

            {/* Featured Travel Partners */}
            <Card className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-blue-800 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Featured Travel Partners</CardTitle>
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
              </CardContent>
            </Card>

            {/* Places to Visit */}
            <Card className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-blue-800 rounded-lg">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
