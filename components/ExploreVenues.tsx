"use client"

import { Star, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAllVenues } from "@/lib/data/events"

const venues = getAllVenues()

export default function ExploreVenues() {
  const router = useRouter()

  const handleVenueClick = (venue: (typeof venues)[0]) => {
    // Navigate to events page filtered by venue
    router.push(`/venue/${venue.id}`)
  }

  const handleViewAllClick = () => {
    // Navigate to all events
    router.push("/venue")
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="">
        {/* Header */}
        <div className="px-6 py-6 border-b text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Explore Venues</h2>
        </div>

        {/* Venues Grid */}
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => { handleVenueClick(venue) }}
                className="group rounded-sm p-3 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="space-y-1">
                  {/* Venue Image - fixed height */}
                  <div className="h-[200px] rounded-sm overflow-hidden">
                    <img
                      src={venue.images[0] || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>

                  {/* Venue Info */}
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-black">{venue.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs text-black font-medium">{venue.rating.count}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center text-blue-100">
                        <MapPin className="w-3 h-3 mr-1 text-black" />
                        <span className="text-xs text-black">{venue.location.city}</span>
                      </div>

                      <div className="flex text-black text-sm">
                        <p>{venue.description}</p> 
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>


          {/* View All Button */}
          <div className="text-center">
            <button
              onClick={handleViewAllClick}
              className="px-8 py-3 bg-[#002C71] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
