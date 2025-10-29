"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const cities = [
  { id: 1, name: "London", icon: "/icon/London.jpg", color: "text-red-600" },
  { id: 2, name: "Dubai", icon: "/icon/Dubai.png", color: "text-yellow-600" },
  { id: 3, name: "Berlin", icon: "/icon/berlin.png", color: "text-red-600" },
  { id: 4, name: "Amsterdam", icon: "/icon/Amsterdam.png", color: "text-blue-600" },
  { id: 5, name: "Paris", icon: "/icon/paris-01.png", color: "text-green-600" },
  { id: 6, name: "Washington DC", icon: "/icon/Washington DC.png", color: "text-purple-600" },
  { id: 7, name: "New York", icon: "/icon/new york-01.png", color: "text-purple-600" },
  { id: 8, name: "Barcelona", icon: "/icon/Barcelona.png", color: "text-green-600" },
  { id: 9, name: "Kuala Lumpur", icon: "/icon/Kuala Lumpur.png", color: "text-blue-600" },
  { id: 10, name: "Orlando", icon: "/icon/Orlando.png", color: "text-yellow-600" },
  { id: 11, name: "Chicago", icon: "/icon/chicago.png", color: "text-purple-600" },
  { id: 12, name: "Munich", icon: "/icon/munich.png", color: "text-purple-600" },
]

export default function BrowseByCity() {
  const router = useRouter()
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchCityCounts = async () => {
      try {
        const res = await fetch("/api/events?stats=true&group=city")
        const data = await res.json()
        const map: Record<string, number> = {}
        data.cities.forEach((c: any) => {
          map[c.city] = c.count
        })
        setCounts(map)
      } catch (error) {
        console.error("Error fetching city stats:", error)
      }
    }

    fetchCityCounts()
  }, [])

  const handleCityClick = (city: (typeof cities)[0]) => {
    router.push(`/event?location=${encodeURIComponent(city.name)}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Browse Event By City
          </h2>
        </div>

        {/* City Grid */}
        <div className="p-2">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            {cities.map((city) => {
              const count = counts[city.name] || 0
              const formatted =
                count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count

              return (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  className="group relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white aspect-[4/3] flex flex-col items-center justify-center p-4"
                >
                  <div className="mb-3 p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
                    <Image
                      src={city.icon}
                      alt={city.name}
                      width={40}
                      height={40}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-gray-900 font-semibold text-sm mb-1">
                      {city.name}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {formatted} Events
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
