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

  const followers = Array(6).fill({
  name: "Ramesh S",
  company: "Mobile Technology",
  location: "Chennai, India",
  imageUrl: "/logo/180 x 180.png", // Replace with actual image URL or path
});

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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 pt-3 overflow-hidden">
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
                 
                 <div className="max-w-4xl mx-auto  py-8 space-y-8 font-sans">
      {/* Listed In Section */}
                   <div>
                   <h2 className="text-xl font-semibold text-gray-900 mb-2">Listed In</h2>
                   <div className="bg-white border border-blue-200 rounded-md p-4 flex flex-wrap gap-2 text-sm">
                     {[
                       "#Automation", "#PrecisionEngineering", "#IndustrialAutomation", "#SmartManufacturing", "#Robotics",
                       "#ProcessAutomation", "#DigitalManufacturing", "#PrecisionTechnology", "#AutomationTechnology",
                       "#AdvancedManufacturing", "#CNCPresicion", "#MotionControl", "#Mechatronics", "#PLCProgramming",
                       "#FactoryAutomation", "#SensorTechnology", "#RoboticAutomation", "#IndustrialRobotics",
                       "#AutomationSolutions", "#AccuracyMatters"
                      ].map((tag, idx) => (
                    <span key={idx} className="text-blue-700 whitespace-nowrap">{tag}</span>
                   ))}
                  </div>
                  </div>

      {/* Exhibitor Profile Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Exhibitor Profile</h2>
        <div className="bg-white border border-blue-200 rounded-md p-4 text-sm space-y-2 text-gray-800">
          <ul className="list-disc pl-6">
            <li>CNC Machines (Turning, Milling, Grinding, Drilling, Boring, etc.)</li>
            <li>Laser Cutting & Water Jet Cutting Machines</li>
            <li>EDM, Wire Cut, and Electrochemical Machining</li>
            <li>High-Speed Machining Centers & Multi-Axis Machines</li>
            <li>Industrial Robots & Collaborative Robots (Cobots)</li>
          </ul>
        </div>
      </div>
    </div>


                {/* Enhanced Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="hover:shadow-md transition-shadow border rounded-lg pb-4">
                    <CardHeader className="flex item bg-blue-100 p-4  rounded-t-lg mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Timings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                     {/* <div className="flex justify-between items-center">
                        <span className="text-gray-600">Event Duration:</span>
                        <span className="font-semibold">{event.stats.duration}</span>
                      </div>  */}
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

                  <div className="hover:shadow-md transition-shadow border rounded-lg ">
                    <CardHeader className="flex item bg-blue-100 p-4 rounded-t-lg mb-2">
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                        Entry Fee
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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

                  <div className="hover:shadow-md transition-shadow border rounded-lg pb-4">
                    <CardHeader className="flex item bg-blue-100 p-4 rounded-t-lg mb-2">
                      <CardTitle>Dress Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.dressCode}</p>
                    </CardContent>
                  </div>

                  <div className="hover:shadow-md transition-shadow border rounded-lg pb-4">
                    <CardHeader className="flex item bg-blue-100 p-4 rounded-t-lg mb-2">
                      <CardTitle>Age Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.ageLimit}</p>
                    </CardContent>
                  </div>
                </div>
                
                  <Card className="border border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900 text-base">Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Organizer Logo */}
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/images/gpex.jpg" // Replace with your actual image path
              alt="Organizer Logo"
              width={96}
              height={96}
              className="object-contain rounded-4xl shadow-sm"
            />
          </div>

          {/* Organizer Details */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-blue-900 text-sm">ICDCDI BINANCE SKRILL</h3>
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                Top Rated
              </span>
            </div>
            <p className="text-sm text-gray-700">Canada</p>
            <p className="text-sm text-blue-900 mt-1">
              1 Upcoming Events • 8150 Followers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

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

                <div className="py-6 max-w-7xl mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-1">Exhibitor List</h2>
  <p className="text-sm text-gray-500 mb-6">68 Exhibitor of Current Edition</p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
    {followers.map((follower, index) => (
      <div
        key={index}
        className="bg-white shadow-md rounded-lg flex flex-col items-center border"
      >
        <CardContent>
          <div className="flex gap-8 items-center py-4">
            <div className="w-28 flex justify-center">
              <Image
                src={follower.imageUrl}
                alt="Profile"
                width={60}
                height={60}
                className="object-contain shadow-sm mr-12 rounded-md"
              />
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <h3 className="font-semibold ml-10 px-2 text-[#f44336] text-lg border-2 border-[#f44336] rounded-md">+Follow</h3>
              </div>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-700">{follower.company}</p>
          <button className="mt-4 w-full border-2 border-[#f44336] text-white bg-[#f44336] text-sm py-1 rounded-full font-semibold hover:bg-[#f44336]/10 transition mb-4">
            Schedule Meeting
          </button>
        </CardContent>
      </div>
    ))}
  </div>

  {/* Center the button */}
  <div className="flex justify-center mt-6">
    <button className="bg-[#f44336] text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
      View All Exhibitors
    </button>
  </div>
</div>


                <div className=" py-6 max-w-7xl mx-auto">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Followers</h2>
                  <p className="text-sm text-gray-500 mb-6">68 Exhibitor of Current Edition</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                 {followers.map((follower, index) => (
                   <div
                   key={index}
                   className="bg-white shadow-md rounded-lg flex flex-col items-center  border"
                >
                 {/* <Card className="border border-blue-200"> */}
                <CardHeader>
                {/* <CardTitle className="text-blue-900 text-base">Organizer</CardTitle> */}
                </CardHeader>
             <CardContent>
                <div className="flex  gap-4 items-center">
                 {/* Organizer Logo */}
                <div className="w-24 h-20 flex  justify-center">
               <Image
                src={follower.imageUrl}
                alt="Profile"
                width={80}
                height={80}
              className="object-contain shadow-sm"
            />
          </div>

          {/* Organizer Details */}
          <div>
            <div className="flex  gap-2 mb-1">
              <h3 className="font-semibold  text-blue-900 text-lg">{follower.name}</h3>
            </div>
            <p className="text-sm text-gray-700">{follower.company}</p>
            <p className="text-sm text-gray-700">{follower.location}</p>
            {/* <p className="text-sm text-blue-900 mt-1">
              1 Upcoming Events • 8150 Followers
            </p> */}
          </div>
        </div>
        <button className="mt-4 w-full border-2 border-[#f44336] text-[#f44336] text-sm py-1 rounded-full font-semibold hover:bg-[#f44336]/10 transition mb-4">
              Connect
            </button>
      </CardContent>
    {/* </Card> */}
    </div>
        ))}
      </div>
    </div>


    <div className="space-y-6">
      {/* Write a Review */}
      <div className="border rounded-lg p-4 space-y-2">
        <p className="font-semibold">Write a Review</p>
        <input
          type="text"
          placeholder="Help other visitors by sharing your review"
          className="w-full border p-2 rounded"
        />
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Add Your Review
        </button>
      </div>

      {/* User Rating */}
      <div className="border rounded-lg p-4 space-y-2">
        <p className="font-semibold">User Rating</p>
        <div className="text-blue-800 font-bold text-lg flex items-center gap-2">
          4.4 <Star className="w-4 h-4 fill-red-500 text-red-500" />
        </div>
        <p className="text-sm text-gray-500">69 Rating<br />27 Reviews</p>
      </div>

      {/* User Reviews */}
      <div>
        <p className="font-semibold text-lg mb-2">User Reviews</p>

        {/* Review Card 1 */}
        <div className="border rounded-lg p-4 mb-4 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                R
              </div>
              <div>
                <p className="font-semibold">Ramesh S</p>
                <p className="text-xs text-gray-500">Vice President at Mobile Technology<br />Chennai, India</p>
              </div>
            </div>
            <div className="flex items-center font-bold text-blue-800">
              4.4 <Star className="w-4 h-4 fill-red-500 text-red-500 ml-1" />
            </div>
          </div>
        </div>

        {/* Review Card 2 */}
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                R
              </div>
              <div>
                <p className="font-semibold">Ramesh S</p>
                <p className="text-xs text-gray-500">Vice President at Mobile Technology<br />Chennai, India</p>
              </div>
            </div>
            <div className="flex items-center font-bold text-blue-800">
              5 <Star className="w-4 h-4 fill-red-500 text-red-500 ml-1" />
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global reach of the fashion and apparel industry. ...
            <span className="text-red-500 font-semibold cursor-pointer"> Read More</span>
          </p>
        </div>

        {/* Pagination */}
        <div className="flex gap-2 mt-4">
          <button className="border px-4 py-1 rounded">Prev</button>
          <button className="border px-4 py-1 rounded">Next</button>
        </div>
      </div>
    </div>
              </TabsContent>


                <TabsContent value="organizer">
                  <Card className="border border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900 text-base">Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Organizer Logo */}
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/images/gpex.jpg" // Replace with your actual image path
              alt="Organizer Logo"
              width={96}
              height={96}
              className="object-contain rounded-4xl shadow-sm"
            />
          </div>

          {/* Organizer Details */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-blue-900 text-sm">ICDCDI BINANCE SKRILL</h3>
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                Top Rated
              </span>
            </div>
            <p className="text-sm text-gray-700">Canada</p>
            <p className="text-sm text-blue-900 mt-1">
              1 Upcoming Events • 8150 Followers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
                </TabsContent>
                {/* Venue Map */}
                <TabsContent value="venue">
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
                <div className="py-6 max-w-7xl mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-1">Exhibitor List</h2>
  <p className="text-sm text-gray-500 mb-6">68 Exhibitor of Current Edition</p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
    {followers.map((follower, index) => (
      <div
        key={index}
        className="bg-white shadow-md rounded-lg flex flex-col items-center border"
      >
        <CardContent>
          <div className="flex gap-8 items-center py-4">
            <div className="w-28 flex justify-center">
              <Image
                src={follower.imageUrl}
                alt="Profile"
                width={60}
                height={60}
                className="object-contain shadow-sm mr-12 rounded-md"
              />
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <h3 className="font-semibold ml-10 px-2 text-[#f44336] text-lg border-2 border-[#f44336] rounded-md">+Follow</h3>
              </div>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-700">{follower.company}</p>
          <button className="mt-4 w-full border-2 border-[#f44336] text-white bg-[#f44336] text-sm py-1 rounded-full font-semibold hover:bg-[#f44336]/10 transition mb-4">
            Schedule Meeting
          </button>
        </CardContent>
      </div>
    ))}
  </div>

  {/* Center the button */}
  {/* <div className="flex justify-center mt-6">
    <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
      View All Exhibitors
    </button>
  </div> */}
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
                <div className="py-6 max-w-7xl mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-1">Speker List</h2>
  <p className="text-sm text-gray-500 mb-6">68 speakers of Current Edition</p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
    {followers.map((follower, index) => (
      <div
        key={index}
        className="bg-white shadow-md rounded-lg flex flex-col items-center border"
      >
        <CardContent>
          <div className="flex gap-8 items-center py-4">
            <div className="w-28 flex justify-center">
              <Image
                src={follower.imageUrl}
                alt="Profile"
                width={60}
                height={60}
                className="object-contain shadow-sm mr-12 rounded-md"
              />
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <h3 className="font-semibold ml-10 px-2 text-[#f44336] text-lg border-2 border-[#f44336] rounded-md">+Follow</h3>
              </div>
            </div>
          </div>
          <p className="text-xl font-bold text-gray-700">{follower.company}</p>
          <button className="mt-4 w-full border-2 border-[#f44336] text-white bg-[#f44336] text-sm py-1 rounded-full font-semibold hover:bg-[#f44336]/10 transition mb-4">
            Schedule Meeting
          </button>
        </CardContent>
      </div>
    ))}
  </div>

  {/* Center the button */}
  {/* <div className="flex justify-center mt-6">
    <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
      View All Exhibitors
    </button>
  </div> */}
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
            <div className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-[#002c71] rounded-lg">
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
                      {/* <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p> */}
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {/* {item.category} */}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* <Button variant="outline" className="w-full" size="sm">
                  View All Items
                </Button> */}
              </CardContent>
            </div>

            {/* Featured Exhibitors */}
            {/* <Card className="hover:shadow-md transition-shadow">
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
                <Button variant="outline" className="w-full" size="sm">
                  View All Exhibitors
                </Button>
              </CardContent>
            </Card> */}

            {/* Places to Visit */}
            <div className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-[#002c71] rounded-lg">
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
                {/* <Button variant="outline" className="w-full" size="sm">
                  Explore {event.location.city}
                </Button> */}
              </CardContent>
            </div>
            <div className="hover:shadow-md transition-shadow border-r-2 border-b-4 border-[#002c71] rounded-lg">
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
                {/* <Button variant="outline" className="w-full" size="sm">
                  Explore {event.location.city}
                </Button> */}
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
