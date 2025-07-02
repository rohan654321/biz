// "use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Share2, Star } from "lucide-react"

// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Search, ChevronDown, User } from "lucide-react"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

interface SpeakerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { id } = await params

  // Mock speaker data
  const speaker = {
    id: id,
    name: "Ramesh S",
    title: "CEO & Co-Founder",
    image: "/images/gpex.jpg",
    bio: "Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global reach of the fashion and apparel industry.Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global reach of the fashion and apparel industry. Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S.",
    dateOfBirth: "September 10 1980",
    mobileNumber: "+91 9999787865",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
      description: "Join us for the biggest fitness event of the year! Featuring top trainers, workshops, and fitness challenges.",
      interestedCount: 120,
      rating: 4.5,
    },
    {
      id: 2,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
      description: "Join us for the biggest fitness event of the year! Featuring top trainers, workshops, and fitness challenges.",
      interestedCount: 150,
      rating: 4.7,
    },
    {
      id: 3,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
      description: "Join us for the biggest fitness event of the year! Featuring top trainers, workshops, and fitness challenges.",
      interestedCount: 200,
      rating: 4.8,
    },
    {
      id: 4,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
      description: "Join us for the biggest fitness event of the year! Featuring top trainers, workshops, and fitness challenges.",
      interestedCount: 180,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
    },
    {
      id: 6,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
    },
    {
      id: 7,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
    },
    {
      id: 8,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/images/gpex.jpg",
    },
  ]

  const pastEvents = [
    {
      id: 5,
      title: "Tech Summit 2024",
      date: "Mon 15 - Wed 17 Jan 2024",
      location: "Mumbai, India",
      image: "/images/gpex.jpg",

      description: "A gathering of tech enthusiasts and industry leaders to discuss the latest trends in technology.",
      interestedCount: 300,
      rating: 4.9,

    },
    {
      id: 6,
      title: "Business Expo 2024",
      date: "Fri 20 - Sun 22 Mar 2024",
      location: "Delhi, India",
      image: "/images/gpex.jpg",
      description: "An exhibition showcasing the latest innovations in business and entrepreneurship.",
      interestedCount: 250,
      rating: 4.3,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* Hero Section */}
      <div className="">
        {/* Background Image */}
        <div className="absolute inset-0 h-80">
          <Image
            src="/images/gpex.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 bg-white backdrop-blur-sm rounded-lg shadow-lg ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Speaker Profile */}
            <div className="flex flex-col items-center text-center ">
              {/* Profile Image with Orange Border */}
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
              </div>

              {/* Speaker Info */}
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{speaker.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{speaker.title}</p>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href={speaker.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a
                  href={speaker.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href={speaker.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href={speaker.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Personal Information */}
            <div className="">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Personal Information</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{speaker.bio}</p>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Date of Birth</h3>
                  <p className="text-gray-600 text-sm">{speaker.dateOfBirth}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Mobile Number</h3>
                  <p className="text-gray-600 text-sm">{speaker.mobileNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Date of Birth</h3>
                  <p className="text-gray-600 text-sm">{speaker.dateOfBirth}</p>
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
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Past
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <div className="hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white border border-gray-200 max-w-sm">
                  <CardContent className="p-4">
        {/* Event Image */}
        <div className="relative">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={220}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Event Title, Date, Location */}
        <div className="py-5 text-center ">
          <h3 className="font-bold text-lg text-blue-900 mb-1">{event.title}</h3>
          <p className="text-sm text-blue-700 font-medium">{event.date}</p>
          <p className="text-sm text-gray-600 mb-2">{event.location}</p>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mt-5">
            {event.description}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Interested Button */}
          <Button variant="outline" className="text-sm px-3 py-1">
            Interested <span className="ml-1 text-gray-600 font-medium">{event.interestedCount}</span>
          </Button>
                    <Button variant="outline" className="text-sm px-3 py-1 border-transparent ">
            {/* Interested <span className="ml-1 text-gray-600 font-medium">{event.interestedCount}</span> */}
          </Button>
          {/* Rating Badge */}
          <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
            {event.rating} <Star className="w-4 h-4 ml-1 fill-green-800" />
          </div>

          {/* Share Icon */}
          <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </CardContent>
    </div>
              ))}
            </div>
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                
                  <div className="hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white border border-gray-200 max-w-sm">
                  <CardContent className="p-4">
        {/* Event Image */}
        <div className="relative">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            width={400}
            height={220}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Event Title, Date, Location */}
        <div className="py-5 text-center ">
          <h3 className="font-bold text-lg text-blue-900 mb-1">{event.title}</h3>
          <p className="text-sm text-blue-700 font-medium">{event.date}</p>
          <p className="text-sm text-gray-600 mb-2">{event.location}</p>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mt-5">
            {event.description}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Interested Button */}
          <Button variant="outline" className="text-sm px-3 py-1">
            Interested <span className="ml-1 text-gray-600 font-medium">{event.interestedCount}</span>
          </Button>
                    <Button variant="outline" className="text-sm px-3 py-1 border-transparent ">
            {/* Interested <span className="ml-1 text-gray-600 font-medium">{event.interestedCount}</span> */}
          </Button>
          {/* Rating Badge */}
          <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
            {event.rating} <Star className="w-4 h-4 ml-1 fill-green-800" />
          </div>

          {/* Share Icon */}
          <Share2 className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
