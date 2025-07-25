"use client"

import {
  Share2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { events } from "@/lib/data/events"

// Filter only featured events
const featuredEvents = Object.values(events).filter((event) => event.featured)

export default function FeaturedEvents() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const eventsPerSlide = 3
  const totalSlides = Math.ceil(featuredEvents.length / eventsPerSlide)

  useEffect(() => {
    if (!isAutoSliding || isHovering) return

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

  const getCurrentEvents = () => {
    const start = currentSlide * eventsPerSlide
    return featuredEvents.slice(start, start + eventsPerSlide)
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 mt-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">
            Featured Events
          </h2>
          <p className="text-gray-600">Handpicked Popular Events</p>
        </div>

        {/* Events Container */}
        <div
          className="relative p-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation */}
          <button
            onClick={() => handleManualSlide("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button
            onClick={() => handleManualSlide("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Event Cards */}
          <div ref={containerRef} className="transition-all duration-500 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentEvents().map((event, index) => (
                <div
                  key={`${currentSlide}-${event.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Event Logo */}
                  <div className="rounded-lg p-4 mb-4 flex items-center justify-center h-20">
                    <img
                      src={event.logo || "/placeholder.svg"}
                      alt={event.title}
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>

                  {/* Event Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(event.timings.startDate).toDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {event.location.venue}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.categories || "General"}
                      </span>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-blue-600 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
