// components/ExploreVenues.tsx
"use client"

import { useState } from "react"
import { Star, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { getAllVenues } from "@/lib/data/events" // <-- must be client-safe

export default function ExploreVenues() {

  const venues = getAllVenues() 
  const router = useRouter()
  // If getAllVenues returns an array directly:
  // const initial = getAllVenues && typeof getAllVenues === "function" ? getAllVenues() : []
  // // If it returns a Promise (unlikely for client import) you could adapt, but prefer server/api approach in that case.
  // const [venues] = useState(initial)

  const handleVenueClick = (venue: typeof venues[number]) => {
    router.push(`/venue/${venue.id}`)
  }

  const handleViewAllClick = () => router.push("/venue")

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div>
        <div className="px-6 py-6 border-b text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Explore Venues</h2>
        </div>

         <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {venues.map((venue: any) => (
              <button
                key={venue.id}
                onClick={() => handleVenueClick(venue)}
                className="group rounded-sm p-3 bg-white transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg text-left"
              >
                <div className="space-y-1">
                  <div className="h-[200px] rounded-sm overflow-hidden">
                    <img
                      src={venue.images[0] || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-black">{venue.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs text-black font-medium">
                          {venue.rating.average}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-black" />
                        <span className="text-xs text-black">
                          {venue.location.address}
                        </span>
                      </div>

                      <div className="text-black text-sm">
                        <p> {venue.capacity.total} capacity</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 mt-1 line-clamp-2 mt-2">
                      {venue.description ?? ""}
                    </p>
                  </div>
                </div>
               </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleViewAllClick}
              className="px-8 py-3 bg-[#002C71] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
