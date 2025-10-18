"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, UserPlus, Users } from "lucide-react"

export interface Venue {
  id: string
  venueName: string
  venueCity: string
  venueCountry: string
  venueState?: string
  venueAddress?: string
}

export interface Event {
  id: string
  title: string
  leads: string
  bannerImage?: string
  logo?: string
  edition?: string
  categories?: string[]
  followers?: number
  startDate: string
  endDate?: string
  venueId?: string
  venue?: Venue // Add this
  location?: {
    city: string
    venue?: string
    country?: string
    address?: string
  }
}

export default function EventReviews() {
  const [nearByEvents, setNearByEvents] = useState<Event[]>([])
  const [visitorCounts, setVisitorCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchNearByEvents = async () => {
      try {
        const response = await fetch("/api/events?featured=true")
        const data = await response.json()
        const eventsWithLocation = data.events.map((event: Event) => ({
          ...event,
          location: event.venue
            ? {
              venue: event.venue.venueName,
              city: event.venue.venueCity,
              country: event.venue.venueCountry,
              address: event.venue.venueAddress,
            }
            : undefined,
        }))
        const shuffled = eventsWithLocation.sort(() => 0.5 - Math.random())
        setNearByEvents(shuffled.slice(0, 4))
      } catch (error) {
        console.error("Error fetching featured events:", error)
      }
    }
    fetchNearByEvents()
  }, [])

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("visitorCounts") : null
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>
        setVisitorCounts(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const handleVisitClick = (e: React.MouseEvent<HTMLButtonElement>, event: Event, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    const id = event.id || String(index)
    setVisitorCounts((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 }
      try {
        localStorage.setItem("visitorCounts", JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
    alert("Thank you for showing interest on this event!")
  }
  const formatFollowers = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <section className="py-12 px-6 bg-white max-w-6xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A2B61]">
          We are the world's largest eventgoer community
        </h2>
        <p className="text-gray-600 mt-2">Every minute 570 people are finding new opportunities at events</p>
      </div>

      {/* Cards - Updated grid to show 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[15px] max-w-7xl mx-auto">
        {nearByEvents.map((event, index) => (
          <div
            key={event.id || index}
            className="bg-white shadow-md overflow-hidden hover:shadow-xl border border-gray-100 text-center"
          >
            {/* Gradient Top Banner */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={event.logo || "/herosection-images/food.jpg"}
                alt="event logo"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Edition Tag */}
              <div className="absolute top-2 left-2 flex items-center z-10">
                <span className="bg-red-600 text-white text-sm font-bold px-1.5 py-0.5 rounded-sm mr-1">{event.edition || "2 Edition"}</span>
                {/* <span className="bg-white text-[#0A2B61] font-semibold text-sm px-2 py-0.5 rounded-r-md">Edition</span> */}
              </div>

              {/* Categories */}
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                {event.categories?.slice(0, 2).map(
                  (
                    cat,
                    idx, // Limit to 2 categories for better fit
                  ) => (
                    <span key={idx} className="bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full shadow-sm">
                      {cat}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-center items-center gap-4 mb-3">
                <span className="text-gray-700 text-sm flex items-center gap-1">
                  <Users size={18} className="text-gray-500" />
                  {formatFollowers(visitorCounts[event.id] || 0)} Followers
                </span>

                <button
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm shadow-sm"
                  aria-label="Visit event"
                  onClick={(e) => handleVisitClick(e, event, index)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Save
                </button>
              </div>

              <h3 className="font-extrabold text-base text-black line-clamp-2 min-h-[2.5rem]">
                {event.title || "DIEMEX 2025"}
              </h3>

              {/* Updated location display with address */}
              <p className="flex justify-center items-center font-bold text-gray-700 text-xs mt-1 text-center line-clamp-2 min-h-[2rem]">
                {event.location?.venue ? `${event.location.venue}, ` : ""}
                {event.location?.city}, {event.location?.country}
              </p>

              {/* Display address if available */}
              {event.location?.address && (
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{event.location.address}</p>
              )}

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
