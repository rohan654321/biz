// components/EventReviews.tsx
"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

export interface Event {
  id: string
  title: string
  bannerImage?: string
  logo?: string
  images?: string[]
  startDate: string
  city?: string
  categories?: string
  featured?: boolean
  timings?: {
    startDate: string
    endDate?: string
  }
  location?: {
    city: string
    venue: string
    address: string
    country?: string
    coordinates: { lat: number; lng: number }
  }
}

export default function EventReviews() {
  const [nearByEvents, setNearByEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchNearByEvents = async () => {
      try {
        const response = await fetch("/api/events?featured=true")
        const data = await response.json()

        // Shuffle + pick 3 random events
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {nearByEvents.map((event, index) => (
          <div
            key={event.id || index}
            className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Top Image */}
            <div className="h-32 bg-gray-200 overflow-hidden">
              <img
                src={event.bannerImage || event.logo || "/herosection-images/food.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.location?.city || "Location not available"}</p>

              {/* Mock review text since your API doesn’t have reviews */}
              <p className="text-sm mt-3">
                Amazing experience! Great opportunity to connect with people.
              </p>

              {/* Rating */}
              <div className="flex items-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Reviewer - mock for now */}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span className="font-medium">Eventgoer</span>
                <span>{new Date(event.startDate).toLocaleDateString("en-US")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
