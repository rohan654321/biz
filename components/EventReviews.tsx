"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, UserPlus, Users } from "lucide-react"

export interface Event {
  id: string
  title: string
  bannerImage?: string
  logo?: string
  edition?: string
  categories?: string[]
  followers?: number
  startDate: string
  endDate?: string
  location?: {
    city: string
    venue?: string
    country?: string
  }
}

export default function EventReviews() {
  const [nearByEvents, setNearByEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchNearByEvents = async () => {
      try {
        const response = await fetch("/api/events?featured=true")
        const data = await response.json()
        const shuffled = data.events.sort(() => 0.5 - Math.random())
        setNearByEvents(shuffled.slice(0, 3))
      } catch (error) {
        console.error("Error fetching featured events:", error)
      }
    }

    fetchNearByEvents()
  }, [])

  return (
    <section className="py-12 px-6 bg-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A2B61]">
          We are the world's largest eventgoer community
        </h2>
        <p className="text-gray-600 mt-2">
          Every minute 570 people are finding new opportunities at events
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {nearByEvents.map((event, index) => (
          <div
  key={event.id || index}
  className="bg-white shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 text-center"
>
  {/* Gradient Top Banner */}
  <div className="relative h-40 w-full overflow-hidden">  {/* reduced from h-64 → h-40 */}
    <img
      src={event.logo || "/herosection-images/food.jpg"}
      alt="event logo"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Edition Tag */}
    <div className="absolute top-2 left-2 flex items-center z-10">
      <span className="bg-red-600 text-white text-sm font-bold px-1.5 py-0.5 rounded-sm mr-1">
        2
      </span>
      <span className="bg-white text-[#0A2B61] font-semibold text-sm px-2 py-0.5 rounded-r-md">
        Edition
      </span>
    </div>

    {/* Categories */}
    <div className="absolute top-2 right-2 flex gap-2 z-10">
      {event.categories?.map((cat, idx) => (
        <span
          key={idx}
          className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow-sm"
        >
          {cat}
        </span>
      ))}
    </div>
  </div>

  {/* Content */}
  <div className="p-4"> {/* reduced from p-5 → p-4 */}
    <div className="flex justify-center items-center gap-4 mb-3"> {/* reduced gap & margin */}
      <span className="text-gray-700 text-sm flex items-center gap-1">
        <Users size={18} className="text-gray-500" />
        {event.followers || 131} Followers
      </span>
      <button className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm shadow-sm">
        <UserPlus className="w-4 h-4 mr-1" />
        Follow
      </button>
    </div>

    <h3 className="font-extrabold text-base text-black"> {/* reduced from text-lg → text-base */}
      {event.title || "DIEMEX 2025"}
    </h3>

    <p className="flex justify-center items-center font-bold text-gray-700 text-xs mt-1 text-center">
      {event.location?.venue
         ?`${event.location.venue}, `
        : ''}
      {event.location?.city || "Chennai Trade Center"}, {event.location?.country || "INDIA"}
    </p>

    <p className="flex justify-center items-center text-gray-900 font-bold mt-2 text-sm">
      <Calendar className="w-4 h-4 mr-1 text-gray-600" />
      {new Date(event.startDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
      {event.endDate
        ? ` - ${new Date(event.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`
        : ""}
    </p>
  </div>
</div>

        ))}
      </div>
    </section>
  )
}
