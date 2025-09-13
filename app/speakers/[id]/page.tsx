"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { FaLinkedinIn } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { fetchSpeakerProfile, type SpeakerProfile } from "@/lib/api/speakers"

interface SpeakerPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  const [speaker, setSpeaker] = useState<SpeakerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [speakerId, setSpeakerId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const loadSpeaker = async () => {
      try {
        const resolvedParams = await params
        setSpeakerId(resolvedParams.id)
        setLoading(true)

        const response = await fetchSpeakerProfile(resolvedParams.id)
        if (response.success) {
          setSpeaker(response.profile)
        } else {
          setError(response.error || "Speaker not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load speaker")
      } finally {
        setLoading(false)
      }
    }

    loadSpeaker()
  }, [params])

  // Mock events data - you can implement this with real API later
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
      title: "Tech Conference 2025",
      date: "Mon 15 - Wed 17 July 2025",
      location: "Mumbai, India",
      image: "/placeholder.svg?height=120&width=180&text=Tech+Event",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading speaker profile...</p>
        </div>
      </div>
    )
  }

  if (error || !speaker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || "Speaker not found"}</p>
          <Button onClick={() => router.push("/speakers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Speakers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => router.push("/speakers")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Speakers
        </Button>
      </div>

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
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-white rounded-lg shadow-lg">
            {/* Speaker Profile */}
            <div className="flex flex-col items-center text-center p-6">
              {/* Profile Image with Orange Border */}
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full border-8 border-orange-500 overflow-hidden bg-white p-2">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Speaker"
                    alt={speaker.fullName}
                    width={200}
                    height={200}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Speaker Info */}
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{speaker.fullName}</h1>
              <p className="text-lg text-gray-600 mb-2">{speaker.designation}</p>
              {speaker.company && <p className="text-md text-blue-600 mb-6">{speaker.company}</p>}

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                  >
                    <FaLinkedinIn className="w-5 h-5" />
                  </a>
                )}
                {speaker.website && (
                  <a
                    href={speaker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  >
                    🌐
                  </a>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Personal Information</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">{speaker.bio}</p>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {speaker.location && (
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Location</h3>
                    <p className="text-gray-600 text-sm">{speaker.location}</p>
                  </div>
                )}
                {speaker.phone && (
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Phone</h3>
                    <p className="text-gray-600 text-sm">{speaker.phone}</p>
                  </div>
                )}
                {speaker.email && (
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Email</h3>
                    <p className="text-gray-600 text-sm">{speaker.email}</p>
                  </div>
                )}
                {speaker.speakingExperience && (
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Speaking Experience</h3>
                    <p className="text-gray-600 text-sm">{speaker.speakingExperience}</p>
                  </div>
                )}
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
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Past Events
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
  )
}
