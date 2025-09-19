"use client"

import React, { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"

import Link from "next/link"

// lib/data/events.ts
export interface Event {
  id: string
  title: string
  bannerImage?: string
  images?: string[]
  startDate: string
  city?: string
  address?: string
}


interface EventCardProps {
  imageSrc: string
  date: string
  month: string
  year: string
  title: string
  location?: string
}

const EventCard: React.FC<EventCardProps> = ({
  imageSrc,
  date,
  month,
  year,
  title,
  location,
}) => {
  return (
    <div className="flex-shrink-0 w-80 h-[480px] bg-[#F2F2F2] relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-20/5 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-20 bg-white/95 backdrop-blur-sm rounded-sm py-3 shadow-lg mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{date}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{month}</div>
            <div className="text-xs text-gray-500">{year}</div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
        {location && (
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        )}
        <div className="flex items-center text-white/60 text-xs mt-2">
          <Calendar className="w-3 h-3 mr-1" />
          Event Details
        </div>
      </div>
    </div>
  )
}

export default function HeroSlideshow() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [events, setEvents] = useState<Event[]>([])

  // Fetch VIP events from API
  useEffect(() => {
    const fetchVipEvents = async () => {
      try {
        const response = await fetch('/api/events?vip=true')
        const data = await response.json()
        setEvents(data.events || [])
      } catch (error) {
        console.error('Error fetching VIP events:', error)
      }
    }

    fetchVipEvents()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || isHovering || events.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoScrolling, isHovering, events.length])

  // Smooth scroll to current index
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 320 + 24 // w-80 + mx-3 * 2
    const scrollPosition = currentIndex * cardWidth

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
  }, [currentIndex])

  const handleManualScroll = (direction: "left" | "right") => {
    setIsAutoScrolling(false)

    if (direction === "right") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
    }

    // Re-enable auto-scrolling after 6 seconds
    setTimeout(() => setIsAutoScrolling(true), 6000)
  }

  return (
    <div className="bg-white">
      <div className="relative mx-auto px-4">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => handleManualScroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
            aria-label="Previous event"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          <button
            onClick={() => handleManualScroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
            aria-label="Next event"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide py-8"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event, index) => (
              <Link href={`/event/${event.id}`} key={event.id}>
                <EventCard
                  imageSrc={event.bannerImage || event.images?.[0] || "/herosection-images/food.jpg"}
                  date={new Date(event.startDate).getDate().toString()}
                  month={new Date(event.startDate).toLocaleString("default", { month: "short" })}
                  year={new Date(event.startDate).getFullYear().toString()}
                  title={event.title}
                  // location={event.location ? `${event.location.city}, ${event.location.venue}` : event.city}
                   location={event.address}
                />

              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
