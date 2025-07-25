"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Star, MapPin, Calendar, Heart, CheckCircle, Award, Users } from "lucide-react"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { getSpeakerById, getEventsBySpeaker } from "@/lib/data/events"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function SpeakerPage() {
  const params = useParams()
  const router = useRouter()
  const speakerId = params.id as string
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 8

  // Get speaker data
  const speaker = getSpeakerById(speakerId)
  const { upcoming: upcomingEvents, past: pastEvents } = getEventsBySpeaker(speakerId)

  if (!speaker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Speaker Not Found</h1>
          <p className="text-gray-600 mb-4">The speaker you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/events")}>Back to Events</Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    }

    return `${start.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
    })} - ${end.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-80">
          <Image
            src="/placeholder.svg?height=320&width=1200&text=Speaker+Background"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white backdrop-blur-sm rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Speaker Profile */}
              <div className="flex flex-col items-center text-center">
                {/* Profile Image with Border */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full border-8 border-blue-900 overflow-hidden bg-white p-2">
                    <Image
                      src={speaker.image || "/placeholder.svg"}
                      alt={speaker.name}
                      width={200}
                      height={200}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {speaker.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Speaker Info */}
                <h1 className="text-3xl font-bold text-blue-900 mb-2">{speaker.name}</h1>
                <p className="text-lg text-gray-600 mb-2">{speaker.title}</p>
                {speaker.company && <p className="text-md text-blue-600 font-medium mb-4">{speaker.company}</p>}

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-lg">{speaker.rating.average}</span>
                    </div>
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-lg">{speaker.followers}</span>
                    </div>
                    <span className="text-sm text-gray-600">Followers</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-lg">{upcomingEvents.length + pastEvents.length}</span>
                    </div>
                    <span className="text-sm text-gray-600">Events</span>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4">
                  {speaker.socialLinks.facebook && (
                    <a
                      href={speaker.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <FaFacebookF className="w-5 h-5" />
                    </a>
                  )}
                  {speaker.socialLinks.twitter && (
                    <a
                      href={speaker.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  )}
                  {speaker.socialLinks.instagram && (
                    <a
                      href={speaker.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </a>
                  )}
                  {speaker.socialLinks.linkedin && (
                    <a
                      href={speaker.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                    >
                      <FaLinkedinIn className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">About {speaker.name}</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">{speaker.bio}</p>

                {/* Personal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Date of Birth</h3>
                    <p className="text-gray-600 text-sm">{speaker.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Mobile Number</h3>
                    <p className="text-gray-600 text-sm">{speaker.mobileNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                    <p className="text-gray-600 text-sm">{speaker.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Rating</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{speaker.rating.average}</span>
                      <span className="text-sm text-gray-500">({speaker.rating.count} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {speaker.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="font-semibold text-blue-900 mb-3">Key Achievements</h3>
                  <div className="space-y-2">
                    {speaker.achievements.slice(0, 3).map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="upcoming" className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Past ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No upcoming events scheduled</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white border border-gray-200 max-w-sm"
                  >
                    <CardContent className="p-4">
                      {/* Event Image */}
                      <div className="relative">
                        <Image
                          src={event.images[0]?.url || "/placeholder.svg"}
                          alt={event.title}
                          width={400}
                          height={220}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        {event.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">Featured</Badge>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="py-5 text-center">
                        <h3 className="font-bold text-lg text-blue-900 mb-1">{event.title}</h3>
                        <div className="flex items-center justify-center text-sm text-blue-700 font-medium mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDateRange(event.timings.startDate, event.timings.endDate)}
                        </div>
                        <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location.city}, {event.location.country}
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mt-3 line-clamp-3">{event.description}</p>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" className="text-sm px-3 py-1 bg-transparent">
                          <Heart className="w-4 h-4 mr-1" />
                          {event.followers}
                        </Button>

                        <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                          {event.rating.average} <Star className="w-4 h-4 ml-1 fill-green-800" />
                        </div>

                        <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past">
            {pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No past events found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white border border-gray-200 max-w-sm opacity-75"
                  >
                    <CardContent className="p-4">
                      {/* Event Image */}
                      <div className="relative">
                        <Image
                          src={event.images[0]?.url || "/placeholder.svg"}
                          alt={event.title}
                          width={400}
                          height={220}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-gray-500 text-white">Completed</Badge>
                      </div>

                      {/* Event Details */}
                      <div className="py-5 text-center">
                        <h3 className="font-bold text-lg text-blue-900 mb-1">{event.title}</h3>
                        <div className="flex items-center justify-center text-sm text-blue-700 font-medium mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDateRange(event.timings.startDate, event.timings.endDate)}
                        </div>
                        <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location.city}, {event.location.country}
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mt-3 line-clamp-3">{event.description}</p>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="outline" className="text-sm px-3 py-1 bg-transparent" disabled>
                          <Heart className="w-4 h-4 mr-1" />
                          {event.followers}
                        </Button>

                        <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                          {event.rating.average} <Star className="w-4 h-4 ml-1 fill-green-800" />
                        </div>

                        <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
