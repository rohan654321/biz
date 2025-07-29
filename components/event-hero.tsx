"use client"

import { Calendar, Clock, Ticket, Users, AlertTriangle } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/data/events"
import { isEventPostponed, getOriginalEventDates } from "@/lib/data/events"

interface EventHeroProps {
  event: Event
}

export default function EventHero({ event }: EventHeroProps) {
  // Add postponed logic
  const isPostponed = isEventPostponed(event.id)
  const originalDates = getOriginalEventDates(event.id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getMainImage = () => {
    const mainImage = event.images.find((img) => img.type === "main")
    return mainImage?.url || "/placeholder.svg?height=400&width=1200&text=Event+Background"
  }

  // Keen slider setup
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  })

  // Autoplay logic using useEffect
  useEffect(() => {
    const slider = instanceRef.current
    if (!slider) return
    const interval = setInterval(() => {
      slider.next()
    }, 3000)
    return () => clearInterval(interval)
  }, [instanceRef])

  // Media list
  const mediaSlides = [
    { type: "image", src: "/images/gpex.jpg" },
    { type: "image", src: "/images/yogaslide.jpg" },
    { type: "video", src: "/video/17564202-hd_1920_1080_30fps.mp4" },
  ]

  return (
    <div>
      {/* Background Image */}
      <div className="relative w-full h-[300px]">
        <img src={getMainImage() || "/placeholder.svg"} alt={event.title} className="w-full h-full" />
        {/* Postponed overlay badge */}
        {isPostponed && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-orange-100 text-orange-800 border border-orange-300">
              <Clock className="w-4 h-4 mr-1" />
              Postponed
            </Badge>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-7xl  mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] z-10 left-1/2 lg:left-160 -translate-x-1/2">
        {/* Slider Left */}
        <div className="md:w-2/3 w-full h-[300px] relative">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {mediaSlides.map((media, index) => (
              <div key={index} className="keen-slider__slide relative h-full w-full">
                {media.type === "image" ? (
                  <Image src={media.src || "/placeholder.svg"} alt={`Slide ${index}`} fill className=" w-full h-full" />
                ) : (
                  <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                    <source src={media.src} type="video/mp4" />
                  </video>
                )}
                {/* Postponed overlay on media */}
                {isPostponed && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                      <Clock className="w-5 h-5 mr-2" />
                      Event Postponed
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Info */}
        <div className="md:w-1/3 w-full bg-blue-50 p-6 flex flex-col justify-center space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-md text-gray-800 font-bold">India's Largest</p>
            <Image src="/images/verified.png" alt="Verified" width={40} height={40} className="w-8 h-8" />
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-black leading-snug">Die & Mould Exhibition</h2>
            {isPostponed && (
              <Badge className="bg-orange-100 text-orange-800 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Postponed
              </Badge>
            )}
          </div>

          {/* Postponed reason */}
          {isPostponed && event.postponedReason && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-700">{event.postponedReason}</span>
            </div>
          )}

          <div className="space-y-4 text-sm text-gray-800 py-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-black" />
              {isPostponed && originalDates.startDate && originalDates.endDate ? (
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-xs">
                    {formatDate(originalDates.startDate)} – {formatDate(originalDates.endDate)}
                  </span>
                  <span className="text-orange-600 font-medium text-xs">Postponed</span>
                </div>
              ) : (
                <span className={isPostponed ? "text-gray-400" : ""}>11 – 13 June, 2025</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-black" />
              <span className={isPostponed ? "text-gray-400" : ""}>10:00am – 06:00pm</span>
            </div>
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-black" />
              <span className={isPostponed ? "text-gray-400" : ""}>Free Entry</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-black" />
              <span>3032 Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
