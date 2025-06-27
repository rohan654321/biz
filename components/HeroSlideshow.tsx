"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"

interface EventCardProps {
  imageSrc: string
  date: string
  month: string
  year: string
  title: string
  location?: string
}

const EventCard: React.FC<EventCardProps> = ({ imageSrc, date, month, year, title, location }) => {
  return (
    <div className="flex-shrink-0 w-80 h-[480px] bg-[#F2F2F2] relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <img src={imageSrc || "/placeholder.svg"} alt={title} className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-20/5 to-transparent"></div>

      {/* Date Badge */}
      {/* <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{date}</div>
          <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{month}</div>
          <div className="text-xs text-gray-500">{year}</div>
        </div>
      </div> */}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-20 bg-white/95 backdrop-blur-sm rounded-xl py-3 shadow-lg">
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

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const events = [
    {
      imageSrc: "/herosection-images/yoga.jpg",
      date: "19",
      month: "Jan",
      year: "2025",
      title: "Mindful Yoga Retreat",
      location: "Wellness Center",
    },
    {
      imageSrc: "/herosection-images/land.jpg",
      date: "10",
      month: "May",
      year: "2025",
      title: "Global Property Expo 2025",
      location: "Convention Center",
    },
    {
      imageSrc: "/herosection-images/fit.jpg",
      date: "02",
      month: "Oct",
      year: "2024",
      title: "Fitness Festival 2024",
      location: "Sports Complex",
    },
    {
      imageSrc: "/herosection-images/food.jpg",
      date: "11",
      month: "Jun",
      year: "2024",
      title: "Gourmet Food Fair",
      location: "City Park",
    },
    {
      imageSrc: "/herosection-images/land.jpg",
      date: "23",
      month: "Feb",
      year: "2025",
      title: "Luxury Property Showcase",
      location: "Grand Hotel",
    },
    {
      imageSrc: "/herosection-images/test.jpeg",
      date: "15",
      month: "Mar",
      year: "2025",
      title: "Tech Innovation Summit",
      location: "Tech Hub",
    },
  ]

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || isHovering) return

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
      {/* Header */}
      
      {/* Carousel */}
      <div className="relative  mx-auto px-4">
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
            className="flex overflow-x-auto scrollbar-hide py-8 px-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>

        {/* Indicators */}
        {/* <div className="flex justify-center space-x-2 mt-8">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoScrolling(false)
                setTimeout(() => setIsAutoScrolling(true), 6000)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
          
      {/* Auto-scroll Status */}
      {/* <div className="text-center mt-8 pb-16">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div
            className={`w-2 h-2 rounded-full ${isAutoScrolling && !isHovering ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          ></div>
          <span>{isAutoScrolling && !isHovering ? "Auto-scrolling active" : "Auto-scroll paused"}</span>
        </div>
      </div> */}
    </div>
  )
}
