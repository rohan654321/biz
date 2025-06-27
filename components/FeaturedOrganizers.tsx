"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const organizers = [
  {
    id: 1,
    name: "Max Events Pvt Ltd",
    logo: "/Organizers/maxx.png",
    description: "Leading event organizer",
  },
  {
    id: 2,
    name: "Max Exhibitions",
    logo: "/Organizers/maxx.png",
    description: "Exhibition specialists",
  },
  {
    id: 3,
    name: "Max Conferences",
    logo: "/Organizers/maxx.png",
    description: "Conference organizers",
  },
  {
    id: 4,
    name: "Max Trade Shows",
    logo: "/Organizers/maxx.png",
    description: "Trade show experts",
  },
  {
    id: 5,
    name: "Max Corporate Events",
    logo: "/Organizers/maxx.png",
    description: "Corporate event planners",
  },
  {
    id: 6,
    name: "Max Entertainment",
    logo: "/Organizers/maxx.png",
    description: "Entertainment events",
  },
  {
    id: 7,
    name: "Max Sports Events",
    logo: "/Organizers/maxx.png",
    description: "Sports event organizers",
  },
  {
    id: 8,
    name: "Max Cultural Events",
    logo: "/Organizers/maxx.png",
    description: "Cultural event specialists",
  },
]

export default function FeaturedOrganizers() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoSliding, setIsAutoSliding] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  const organizersPerSlide = 4
  const totalSlides = Math.ceil(organizers.length / organizersPerSlide)

  // Auto-slide functionality
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

    // Re-enable auto-sliding after 6 seconds
    setTimeout(() => setIsAutoSliding(true), 6000)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
    setIsAutoSliding(false)
    setTimeout(() => setIsAutoSliding(true), 6000)
  }

  const getCurrentOrganizers = () => {
    const startIndex = currentSlide * organizersPerSlide
    return organizers.slice(startIndex, startIndex + organizersPerSlide)
  }

  return (
    <div className="w-full max-w-6xl mx-auto ">
      <div className="rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 b text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Featured Organizers</h2>
          <p className="text-gray-600">Worldwide Organizers</p>
        </div>

        {/* Organizers Container */}
        <div
          className="relative p-6"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={() => handleManualSlide("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group opacity-0 group-hover:opacity-100"
            aria-label="Previous organizers"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          <button
            onClick={() => handleManualSlide("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group opacity-0 group-hover:opacity-100"
            aria-label="Next organizers"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Organizers Grid */}
          <div className="transition-all duration-500 ease-in-out">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentOrganizers().map((organizer, index) => (
                <div
                  key={`${currentSlide}-${organizer.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 group cursor-pointer animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Organizer Logo */}
                  <div className="flex items-center justify-center h-20 mb-4">
                    <img
                      src={organizer.logo || "/placeholder.svg"}
                      alt={organizer.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Organizer Info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {organizer.name}
                    </h3>
                    <p className="text-xs text-gray-500">{organizer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-slide Status */}
          {/* <div className="flex justify-center mt-4">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isAutoSliding && !isHovering ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span>{isAutoSliding && !isHovering ? "Auto-sliding" : "Paused"}</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
