"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPlay } from "react-icons/fa"
import { ShareButton } from "@/components/share-button"

interface Speaker {
  id: string
  name: string
  title: string
  bio: string
  image: string
  location: string
  mobileNumber: string
  website: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
}

interface Event {
  currentAttendees: number
  averageRating: any
  id: string
  title: string
  date: string
  location: string
  image: string
}

interface Session {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  sessionType: string
  youtube: string[]
  event: {
    id: string
    slug: string
    startDate: string
    endDate: string
  }
}

interface SpeakerPageProps {
  params: Promise<{ id: string }>
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  const [speaker, setSpeaker] = useState<Speaker | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const { id } = await params

        // Speaker Info
        const speakerRes = await fetch(`/api/speakers/${id}`)
        if (!speakerRes.ok) throw new Error("Failed to fetch speaker data")
        const speakerData = await speakerRes.json()

        const s = speakerData.profile
        setSpeaker({
          id,
          name: s.fullName,
          title: s.designation,
          bio: s.bio,
          image: s.avatar || "/image/Ellipse 72.png?height=200&width=200&text=Speaker",
          location: s.location,
          mobileNumber: s.phone,
          website: s.website,
          socialLinks: {
            facebook: s.linkedin || "#",
            twitter: "#",
            instagram: "#",
            linkedin: s.linkedin || "#",
          },
        })
        // Events
        const eventsRes = await fetch(`/api/speakers/${id}/events`)
        const eventsData = await eventsRes.json()
        setUpcomingEvents(eventsData.upcoming || [])
        setPastEvents(eventsData.past || [])

        // Sessions with YouTube videos
        const sessionsRes = await fetch(`/api/speakers/${id}/sessions`)
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json()
          setSessions(sessionsData.sessions || [])
        } else {
          setSessions([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }
  const formatEventDate = (isoString: string) => {
    if (!isoString) return "Invalid date";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };



  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-800 text-lg font-medium">
        Loading speaker profile...
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-medium">
        Error: {error}
      </div>
    )

  if (!speaker)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-medium">
        Speaker not found.
      </div>
    )

  return (
    <div className="bg-white min-h-screen">
      {/* SIMPLIFIED HERO SECTION - Just background */}
      <div className="relative">
        <div className="absolute inset-0 h-80">
          <Image
            src="/logo/logo-5.png?height=320&width=1200&text=Outdoor+Background+with+Palm+Trees"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Empty space for background */}
        <div className="relative z-10 h-80"></div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-4 mt-7 ml-20 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* PROFILE CARD - LEFT SIDE */}
          <div className="w-full lg:w-1/3">
            <div className="">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-orange-500 p-1 bg-white overflow-hidden mb-4">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-blue-900">{speaker.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{speaker.title}</p>

                  <div className="flex justify-center gap-3 mt-4">
                    <a
                      href={speaker.socialLinks.facebook}
                      target="_blank"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href={speaker.socialLinks.twitter}
                      target="_blank"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-400 text-white hover:bg-sky-500 text-sm"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href={speaker.socialLinks.instagram}
                      target="_blank"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700 text-sm"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href={speaker.socialLinks.linkedin}
                      target="_blank"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 text-sm"
                    >
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          {/* ABOUT SECTION - RIGHT SIDE */}
          <div className="w-full lg:w-2/3">
            <div className="">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed">{speaker.bio}</p>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-200 w-3/4 mx-auto my-4 border-t-[1px]" />



      {/* SESSION VIDEOS SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-12 mt-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Session Videos</h2>
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Session Header */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-blue-900 text-sm line-clamp-2 mb-1">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {session.sessionType}
                      </span>
                      <span>{formatDate(session.startTime)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {session.description}
                    </p>
                  </div>

                  {/* YouTube Videos */}
                  {session.youtube && session.youtube.length > 0 ? (
                    <div className="space-y-3">
                      {session.youtube.map((youtubeUrl, index) => {
                        const thumbnail = getYouTubeThumbnail(youtubeUrl)
                        const videoId = extractYouTubeVideoId(youtubeUrl)
                        return (
                          <div key={index} className="group">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                              {thumbnail ? (
                                <>
                                  {/* Use regular img tag for external YouTube images */}
                                  <img
                                    src={thumbnail}
                                    alt={`YouTube thumbnail for ${session.title}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                      <FaPlay className="text-white text-sm ml-1" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                                  <FaYoutube className="text-red-600 text-3xl" />
                                </div>
                              )}
                              <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0"
                              >
                                <span className="sr-only">Watch on YouTube</span>
                              </a>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <FaYoutube className="text-red-600 text-xs" />
                              <span className="text-xs text-gray-600">Watch on YouTube</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <FaYoutube className="text-gray-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">No videos available for this session</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <FaYoutube className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-500">No session videos available.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* EVENTS SECTION */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Tabs defaultValue="upcoming" className="w-full">
          {/* Tabs aligned left and smaller */}
          <TabsList className="flex justify-start space-x-2 mb-4">
            <TabsTrigger
              value="upcoming"
              className="text-sm px-3 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="text-sm px-3 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Past
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="border hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={(e.image || "/images/gpex.jpg").trim()}
                        alt={e.title}
                        width={300}
                        height={180}
                        className="w-full h-32 object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm">{e.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{formatEventDate(e.date)}</p>

                        <p className="text-xs text-gray-500">{e.location}</p>

                        <div className="flex justify-between items-center mt-3">
                          {/* Left side */}
                          {/* <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-1 rounded">
                            Interested {e.currentAttendees || 0}
                          </span> */}
                          <span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded">
                            {e.averageRating?.toFixed(1) || 0} ⭐
                          </span>


                          {/* Right side */}
                          <div className="flex items-center gap-2">
                            <ShareButton eventId={e.id} eventTitle={e.title} />
                          </div>
                        </div>



                      </div>
                    </CardContent>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No upcoming events scheduled.</p>
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.map((e) => (
                  <div key={e.id} className="hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={(e.image || "/images/gpex.jpg").trim()}
                        alt={e.title}
                        width={300}
                        height={180}
                        className="w-full h-32 object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm">{e.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{formatEventDate(e.date)}</p>

                        <p className="text-xs text-gray-500">{e.location}</p>

                        <div className="flex justify-between items-center mt-3">
                          {/* Left side */}
                          {/* <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-1 rounded">
                            Interested {e.currentAttendees || 0}
                          </span> */}

                          {/* Right side */}
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded">
                              {e.averageRating?.toFixed(1) || 0} ⭐
                            </span>
                            <ShareButton eventId={e.id} eventTitle={e.title} />
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No past events found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}