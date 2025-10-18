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
  ticketTypes: string[]
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
    }, 3000)
    return () => clearInterval(interval)
  }, [instanceRef])

  useEffect(() => {
    setImages(event.images || [])
  }, [event.images])

  return (
    <div>
      {/* Background Banner */}
      <div className="relative h-[200px] md:h-[300px] lg:h-[400px]">
        <img src={"/banners/banner1.jpg"} alt={event.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-7xl mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] z-10 left-1/2 lg:left-160 -translate-x-1/2">
        {/* Slider Section */}
        <div className="md:w-2/3 w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[400px] relative">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {images.length > 0 ? (
              <>
                {images.map((img, index) => (
                  <div key={`image-${index}`} className="keen-slider__slide relative h-full w-full">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${event.title} Image ${index + 1}`}
                      fill
                      className="p-4"
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
                <Image src="/herosection-images/test.jpeg" alt="Default Image" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="md:w-1/3 w-full bg-blue-50 p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black leading-snug">{event.title}</h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-800 py-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <p>
                {new Date(event.startDate || "").toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(event.endDate || "").toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>
                {new Date(event.startDate || "").toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                –{" "}
                {new Date(event.endDate || "").toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>{event.ticketTypes?.map((ticket: any) => `${ticket.name}: ₹${ticket.price}`).join(" | ")}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span>{event.leads?.length || 0} Leads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
