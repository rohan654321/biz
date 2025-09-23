"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageBannerCarouselProps {
  images: string[]
  autoPlay?: boolean
  interval?: number
}

export default function ImageBannerCarousel({
  images,
  autoPlay = true,
  interval = 4000,
}: ImageBannerCarouselProps) {
  const [current, setCurrent] = useState(0)

  // autoplay
  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  const prevSlide = () => setCurrent((current - 1 + images.length) % images.length)
  const nextSlide = () => setCurrent((current + 1) % images.length)

  return (
    <div className="relative w-full h-52 md:h-64 lg:h-80 overflow-hidden rounded-xl shadow">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`banner-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Left Arrow */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow"
        onClick={prevSlide}
      >
        <ChevronLeft />
      </Button>

      {/* Right Arrow */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow"
        onClick={nextSlide}
      >
        <ChevronRight />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-2 w-full flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-black" : "bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
