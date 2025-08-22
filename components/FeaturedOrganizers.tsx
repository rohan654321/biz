"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { on } from "events"
import { getAllOrganizers } from "@/lib/data/events"


const organizers = getAllOrganizers()

export default function FeaturedOrganizers() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!scrollRef.current || isHovering) return

    const scrollContainer = scrollRef.current
    const scrollStep = 1
    const interval = setInterval(() => {
      scrollContainer.scrollLeft += scrollStep
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        scrollContainer.scrollLeft = 0
      }
    }, 20)

    return () => clearInterval(interval)
  }, [isHovering])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  const router = useRouter()

   const handleViewAllClick = () => {
    // Navigate to all events
    router.push("/organizer")
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-1">Featured Organizers</h2>
        <p className="text-gray-600">Worldwide Organizers</p>
      </div>

      {/* Organizer Carousel */}
      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={() => scrollByAmount(-300)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow hover:bg-white transition-all hidden group-hover:block"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => scrollByAmount(300)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow hover:bg-white transition-all hidden group-hover:block"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-4"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}</style>

          {organizers.map((organizer:any) => (
            <div
              onClick={() => router.push(`/organizer/${organizer.id}`)}
              key={organizer.id}
              className="max-w-[200px] bg-white border border-gray-200 rounded-sm p-1 flex-shrink-0 hover:shadow-md hover:border-gray-300 transition duration-200"
            >
              <div className="flex items-center justify-center h-10 mb-4">
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{organizer.name}</h3>
                <p className="text-xs text-gray-500">{organizer.description}</p>
                <p className="text-xs text-gray-500">{organizer.events} events</p>
              </div>
            </div>
          ))}
          <button 
              onClick={handleViewAllClick}
            className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group p-14">
              <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">View All</span>
            </button>
        </div>
      </div>
    </div>
  )
}
