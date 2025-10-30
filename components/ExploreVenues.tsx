"use client"
import { useState, useEffect } from "react"
import { Star, MapPin, Calendar } from "lucide-react" // Added Calendar icon
import { useRouter } from "next/navigation"
import { getAllVenues } from "@/lib/data/events"
import Link from "next/link"

const venues = getAllVenues()

export default function ExploreVenues() {
  const [organizers, setOrganizers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrganizersVenue() {
      try {
        const res = await fetch("api/organizers/venues")
        if (!res.ok) throw new Error("Failed to get data")
        const data = await res.json()

        // DEBUG: Check what data we're getting
        console.log("API Response:", data)
        if (data.length > 0) {
          console.log("First venue:", data[0])
          console.log("First venue images:", data[0]?.images)
          console.log("First venue event count:", data[0]?.eventCount) // Check event count
        }

        setOrganizers(data)
      } catch (err) {
        console.error("Error fetching organizer: ", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrganizersVenue()
  }, [])

  if (loading) return <p>Loading .......</p>

  const handleVenueClick = (venue: (typeof venues)[number]) => {
    router.push(`/venue/${venue.id}`)
  }

  // ✅ CORRECT: Use images array from API response
  const getVenueImage = (venue: any) => {
    return venue.images?.[0] || "/city/c1.jpg"
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div>
        <div className="px-6 py-6 border-b border-gray-200 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Explore Venues
          </h2>
        </div>

        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.isArray(organizers) &&
              organizers.map((venue: any, index: number) => (
                <button
                  key={`${venue.id}-${index}`}
                  onClick={() => handleVenueClick(venue)}
                  className="group rounded-md p-3 bg-white transition-all duration-200 
                             hover:scale-105 shadow hover:shadow-lg text-left w-full"
                >
                  <div className="space-y-2">
                    {/* Image */}
                    <div className="h-[160px] rounded-md overflow-hidden relative">
                      <img
                        src={getVenueImage(venue)}
                        alt={venue.name}
                        className="w-full h-full object-cover opacity-90 
                                 group-hover:opacity-100 transition-opacity duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/city/c1.jpg"
                        }}
                      />
                      {/* Event Count Badge */}
                      {venue.eventCount > 0 && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {venue.eventCount} events
                        </div>
                      )}
                    </div>

                    {/* Venue Info */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-black line-clamp-1">
                          {venue.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-xs text-black font-medium">
                            {venue.rating ?? "—"}
                          </span>
                          <span className="text-xs text-gray-600 ml-1">
                            ({venue.reviewCount ?? 0})
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mb-1 line-clamp-1">
                        {/* {venue.description || "No description available"} */}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        {/* Left side: Location */}
                        <div className="flex items-center max-w-[120px]"> {/* adjust width as needed */}
                          <MapPin className="w-3 h-3 mr-1 text-black flex-shrink-0" />
                          <span className="text-xs text-black truncate">
                            {venue.location?.city || "No address"}
                          </span>
                        </div>


                        {/* Right side: Event count */}
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{venue.eventCount ?? 0} events</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>

          <div className="text-center">
            <Link href="/venues">
              <button className="px-8 py-3 bg-[#002C71] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}