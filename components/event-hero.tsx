"use client"

import type React from "react"
import { Calendar, Clock, Ticket, Users } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Event {
  id: string
  title: string
  address?: string
  startDate?: string
  endDate?: string
  postponedReason?: string
  images: string[]
  videos?: string[]
  description: string
  shortDescription: string
  leads: string[]
  ticketTypes: Array<{
    name: string
    price: number
    currency?: string
  }>
  location: {
    city: string
    venue: string
    address: string
    country?: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  followers?: number
  currentAttendees?: number
  maxAttendees?: number
}

interface EventHeroProps {
  event: Event
}

export default function EventHero({ event }: EventHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [images, setImages] = useState<string[]>(event.images || [])

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  useEffect(() => {
    const slider = instanceRef.current
    if (!slider) return
    const interval = setInterval(() => {
      slider.next()
    }, 10000) // Increased from 3000ms to 6000ms (6 seconds)
    return () => clearInterval(interval)
  }, [instanceRef])

  useEffect(() => {
    setImages(event.images || [])
  }, [event.images])

  // Get ticket price display
  const getTicketPriceDisplay = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) {
      return "Free Entry"
    }
    
    const ticketTypes = event.ticketTypes
    return ticketTypes.map(ticket => 
      `${ticket.name}: ${ticket.currency || '₹'}${ticket.price}`
    ).join(" | ")
  }

  // Get followers count - REMOVED the fallback to 0
  const getFollowersCount = () => {
    // Priority: 1. event.followers, 2. event.leads.length, 3. event.currentAttendees
    if (event.followers && event.followers > 0) {
      return event.followers
    }
    if (event.leads && event.leads.length > 0) {
      return event.leads.length
    }
    if (event.currentAttendees && event.currentAttendees > 0) {
      return event.currentAttendees
    }
    return null // Return null instead of 0
  }

  // Format date range
  const formatDateRange = () => {
    if (!event.startDate || !event.endDate) {
      return "Date to be announced"
    }

    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    
    const isSameDay = startDate.toDateString() === endDate.toDateString()
    
    if (isSameDay) {
      return startDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } else {
      return `${startDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })} - ${endDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    }
  }

  // Format time range
 const formatTimeRange = () => {
  if (!event.startDate || !event.endDate) {
    return "Time to be announced"
  }

  const startTime = new Date(event.startDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Force Indian time zone
  })

  const endTime = new Date(event.endDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", // Force Indian time zone
  })

  return `${startTime} – ${endTime}`
}


  const followersCount = getFollowersCount()

  return (
    <div>
      {/* Background Banner */}
      <div className="relative h-[200px] md:h-[300px] lg:h-[200px]">
        <img src={"/banners/banner1.jpg"} alt={event.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-7xl mx-auto bg-white overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] z-10 left-1/2 lg:left-160 -translate-x-1/2 rounded-sm">
        {/* Slider Section */}
        <div className="md:w-2/3 w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[250px] relative">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {images.length > 0 ? (
              <>
                {images.map((img, index) => (
                  <div key={`image-${index}`} className="keen-slider__slide relative h-full w-full">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${event.title} Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {event.videos?.map((vid: string, index: number) => (
                  <div key={`video-${index}`} className="keen-slider__slide relative h-full w-full">
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                      <source src={vid} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </>
            ) : (
              <div className="keen-slider__slide relative h-full w-full">
                <Image 
                  src="/herosection-images/test.jpeg" 
                  alt="Default Image" 
                  fill 
                  className="object-cover" 
                  priority
                />
              </div>
            )}
          </div>

          {/* Slide Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="md:w-1/3 w-full bg-blue-50 p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black leading-snug line-clamp-2">
            {event.title}
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-800 py-2">
            {/* Date */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
              <p className="leading-tight">{formatDateRange()}</p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
              <span className="leading-tight">{formatTimeRange()}</span>
            </div>

            {/* Ticket Price */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
              <span className="leading-tight font-medium">
                {getTicketPriceDisplay()}
              </span>
            </div>

            {/* Followers - ONLY SHOW IF WE HAVE FOLLOWERS */}
            {followersCount !== null && followersCount > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                <span className="leading-tight">
                  {followersCount.toLocaleString()} {followersCount === 1 ? 'Follower' : 'Followers'}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge if postponed */}
          {event.postponedReason && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Postponed: {event.postponedReason}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}