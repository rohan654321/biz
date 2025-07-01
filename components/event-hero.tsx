"use client"

import { Calendar, Clock, Ticket, Users } from "lucide-react"
import { Shield } from "lucide-react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"
import { useEffect, useRef } from "react"
import type { Event } from "@/lib/data/events"

interface EventHeroProps {
  event: Event
}

export default function EventHero({ event }: EventHeroProps) {
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
        <img
          src={getMainImage()}
          alt={event.title}
          className="w-full h-full"
        />
      </div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] z-10 left-1/2 lg:left-145 -translate-x-1/2">

        {/* Slider Left */}
        <div className="md:w-2/3 w-full h-[300px] relative">
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {mediaSlides.map((media, index) => (
              <div key={index} className="keen-slider__slide relative h-full w-full">
                {media.type === "image" ? (
                  <Image
                    src={media.src}
                    alt={`Slide ${index}`}
                    fill
                    className=" w-full h-full"
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

        {/* Right Info */}
        <div className="md:w-1/3 w-full bg-blue-50 p-6 flex flex-col justify-center space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-md text-gray-800 font-bold">India’s Largest</p>
            <Image
              src="/images/verified.png"
              alt="Verified"
              width={40}
              height={40}
              className="w-8 h-8"
            />
          </div>

          <h2 className="text-2xl font-semibold text-black leading-snug">
            Die & Mould Exhibition
          </h2>

          <div className="space-y-4 text-sm text-gray-800 py-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-black" />
              <span>11 – 13 June, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-black" />
              <span>10:00am – 06:00pm</span>
            </div>
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-black" />
              <span>Free Entry</span>
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
