"use client"

import { Share2, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// lib/data/events.ts
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

export default function FeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const eventsPerSlide = 6
  const totalSlides = Math.ceil(featuredEvents.length / eventsPerSlide)

  // ✅ Fetch from API
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await fetch("/api/events?featured=true")
        // const data = await res.json()
       const data = await response.json()
        setFeaturedEvents(data.events || [])

       
      } catch (error) {
        console.error("Error fetching featured events:", error)
      }
    }

    fetchFeaturedEvents()
  }, [])

  // Auto-slide
  useEffect(() => {
    if (!isAutoSliding || isHovering || totalSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoSliding, isHovering, totalSlides])

  const handleManualSlide = (direction: "prev" | "next") => {
    setIsAutoSliding(false)
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    } else {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }
    setTimeout(() => setIsAutoSliding(true), 6000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoSliding(false)
    setTimeout(() => setIsAutoSliding(true), 6000)
  }

  // Create slides
  const slides: Event[][] = []
  for (let i = 0; i < totalSlides; i++) {
    const start = i * eventsPerSlide
    const end = start + eventsPerSlide
    slides.push(featuredEvents.slice(start, end))
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 mt-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Featured Events</h2>
          <p className="text-gray-600">Handpicked Popular Events</p>
        </div>

        {/* Events Container */}
        <div
          className="relative p-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Slides Container */}
          <div className="overflow-hidden">
            <div
              ref={containerRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slideEvents, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slideEvents.map((event) => (
                      <Link href={`/event/${event.id}`} key={event.id} className="cursor-pointer">
                        <div className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 group">
                          <div className="grid grid-cols-2">
                            {/* Event Logo */}
                            <div className="rounded-lg p-4 mb-4 flex items-center justify-center h-20">
                              <img
                                src={event.logo || "/placeholder.svg"}
                                alt={event.title}
                                className="max-h-12 max-w-50px"
                              />
                            </div>

                            {/* Event Info */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {event.title}
                              </h3>

                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">
                                    {new Date(event.startDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex justify-between mt-2">
                            <button
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
                              aria-label="Share event"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                              {event.categories || "General"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {/* Empty slots filler */}
                    {slideEvents.length < eventsPerSlide &&
                      Array.from({ length: eventsPerSlide - slideEvents.length }).map((_, index) => (
                        <div key={`empty-${index}`} className="invisible">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 h-full" />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
