"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function FeaturedOrganizers() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [organizers, setOrganizers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrganizer() {
      try {
        const res = await fetch("/api/organizers")
        if (!res.ok) throw new Error("Failed to fetch organizers")
        const data = await res.json()
        setOrganizers(data.organizers)
      } catch (err) {
        console.error("Error fetching organizers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrganizer()
  }, [])

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" })
  }

  if (loading) return <p className="text-center py-10">Loading organizers...</p>

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
         <div className="py-6 border-b border-gray-200 text-left">
  <h2 className="text-3xl font-semibold text-gray-900 mb-1">
    Featured Organizers
  </h2>
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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 
                     bg-white/90 rounded-full shadow-md hover:bg-white 
                     transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => scrollByAmount(300)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 
                     bg-white/90 rounded-full shadow-md hover:bg-white 
                     transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-1 py-4 hide-scrollbar"
        >
          {organizers.map((organizer: any) => (
            <div
              onClick={() => router.push(`/organizer/${organizer.id}`)}
              key={organizer.id}
              className="w-[200px] bg-white border border-gray-200 rounded-lg 
                         p-4 flex-shrink-0 hover:shadow-lg hover:border-blue-300 
                         transition duration-200 cursor-pointer"
            >
              {/* Organizer Image */}
              <div className="flex items-center justify-center h-20 mb-3">
                <img
                  src={organizer.image || "/herosection-images/fit.jpg"}
                  alt={organizer.name}
                  className="h-full object-cover"
                />
              </div>

              {/* Organizer Info */}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {organizer.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                  {organizer.description || "Organizer of amazing events"}
                </p>
                <p className="text-xs font-medium text-blue-600">
                  {organizer.eventsOrganized ?? 0} events
                </p>
              </div>
            </div>
          ))}

          {/* View All Button */}
          <Link href="/organizers">
            <button
              className="w-[200px] flex flex-col items-center justify-center 
                         bg-gray-50 border-2 border-dashed border-gray-300 
                         rounded-lg hover:border-blue-400 hover:bg-blue-50 
                         transition-all duration-200 flex-shrink-0"
            >
              <MoreHorizontal className="w-8 h-42 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                {/* View All */}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
