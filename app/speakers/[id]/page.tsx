"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    image: "/placeholder.svg?height=200&width=200&text=Ramesh+S",
    bio: "Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global reach of the fashion and apparel industry.Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S, this event attracts a diverse audience from countries such as the USA and Pakistan, showcasing the global reach of the fashion and apparel industry. Texworld Apparel Sourcing Paris is a prominent tradeshow taking place at the Paris Le Bourget Exhibition Centre in Paris, France. Organized by Messe Frankfurt France S.A.S.",
    dateOfBirth: "September 10 1980",
    mobileNumber: "+91 9999787865",
    location : "city,country",
    website : "link",
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
      image: "/placeholder.svg?height=120&width=180&text=Fitness+Event",
    },
    {
      id: 2,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/placeholder.svg?height=120&width=180&text=Fitness+Event",
    },
    {
      id: 3,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/placeholder.svg?height=120&width=180&text=Fitness+Event",
    },
    {
      id: 4,
      title: "Fitness Fest 2025",
      date: "Thu 04 - Sat 06 June 2025",
      location: "Bangalore, India",
      image: "/placeholder.svg?height=120&width=180&text=Fitness+Event",
    },
  ]

  const pastEvents = [
    {
      id: 5,
      title: "Tech Summit 2024",
      date: "Mon 15 - Wed 17 Jan 2024",
      location: "Mumbai, India",
      image: "/placeholder.svg?height=120&width=180&text=Tech+Summit",
    },
    {
      id: 6,
      title: "Business Expo 2024",
      date: "Fri 20 - Sun 22 Mar 2024",
      location: "Delhi, India",
      image: "/placeholder.svg?height=120&width=180&text=Business+Expo",
    },
  ]

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 h-80">
            <Image
              src="/placeholder.svg?height=320&width=1200&text=Outdoor+Background+with+Palm+Trees"
              alt="Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-white">
              {/* Speaker Profile */}
              <div className="flex flex-col items-center text-center p-2 ">
                {/* Profile Image with Orange Border */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full border-8 border-orange-500 overflow-hidden bg-white p-2">
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
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Personal Information</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">{speaker.bio}</p>

                {/* Personal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Location</h3>
                    <p className="text-gray-600 text-sm">{speaker.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Mobile Number</h3>
                    <p className="text-gray-600 text-sm">{speaker.mobileNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Site link</h3>
                    <p className="text-gray-600 text-sm">{speaker.website}</p>
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
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={300}
                          height={180}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Past Events */}
            <TabsContent value="past">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={300}
                          height={180}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
