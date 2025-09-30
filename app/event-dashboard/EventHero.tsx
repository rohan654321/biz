"use client"

import { Calendar, Clock, Ticket, Users, AlertTriangle } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { isEventPostponed, getOriginalEventDates } from "@/lib/data/events"

interface EventImage {
  url: string
  type: string
}

interface Event {
  id: string
  title: string
  address?: string
  startDate?: string
  endDate?: string
  postponedReason?: string
  images: EventImage[]
}

interface EventHeroProps {
  event: Event
}

export default function EventHero({ event }: EventHeroProps) {
  const isPostponed = isEventPostponed(event.id)
  const originalDates = getOriginalEventDates(event.id)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const getMainImage = () => {
    const mainImage = event.images?.find((img) => img.type === "main")
    return mainImage?.url || "/herosection-images/test.jpeg"
  }

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  })

  useEffect(() => {
    const slider = instanceRef.current
    if (!slider) return
    const interval = setInterval(() => {
      slider.next()
    }, 3000)
    return () => clearInterval(interval)
  }, [instanceRef])

  const mediaSlides = event.images?.length
    ? event.images.map((img) => ({ type: "image", src: img.url }))
    : [
        { type: "image", src: "/images/gpex.jpg" },
        { type: "image", src: "/images/yogaslide.jpg" },
        { type: "video", src: "/video/17564202-hd_1920_1080_30fps.mp4" },
      ]

  return (
    <div>
      {/* Background Image */}
      <div className="relative h-[200px] md:h-[300px] lg:h-[400px]">
        <img
          src={getMainImage()}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {isPostponed && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <Badge className="bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1 px-2 py-1 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Postponed
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-100px] sm:mt-[-120px] md:mt-[-150px] z-10 left-1/2 -translate-x-1/2">
        
        {/* Slider */}
        <div className="md:w-2/3 w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[400px] relative">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {mediaSlides.map((media, index) => (
              <div key={index} className="keen-slider__slide relative h-full w-full">
                {media.type === "image" ? (
                  <Image
                    src={media.src}
                    alt={`Slide ${index}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={media.src} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/3 w-full bg-blue-50 p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black leading-snug">
            {event.title}
          </h2>

          {isPostponed && event.postponedReason && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs sm:text-sm text-orange-700">
                {event.postponedReason}
              </span>
            </div>
          )}

          <div className="space-y-3 text-xs sm:text-sm text-gray-800 py-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              {isPostponed && originalDates.startDate && originalDates.endDate ? (
                <div className="flex flex-col">
                  <span className="text-gray-400 line-through text-xs">
                    {formatDate(originalDates.startDate)} – {formatDate(originalDates.endDate)}
                  </span>
                  <span className="text-orange-600 font-medium text-xs">Postponed</span>
                </div>
              ) : (
                <span>
                  {event.startDate && event.endDate
                    ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
                    : "Dates coming soon"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>10:00am – 06:00pm</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>Free Entry</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>3032 Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
