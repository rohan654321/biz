"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Country = {
  id: number
  name: string
  flag: string
  code: string
}

const countries: Country[] = [
  { id: 1, name: "USA", flag: "/flags/USA.png", code: "US" },
  { id: 2, name: "Germany", flag: "/flags/Germany.png", code: "DE" },
  { id: 3, name: "UK", flag: "/flags/UK.png", code: "GB" },
  { id: 4, name: "Canada", flag: "/flags/Canada.png", code: "CA" },
  { id: 5, name: "UAE", flag: "/flags/UAE.png", code: "AE" },
  { id: 6, name: "India", flag: "/flags/India.png", code: "IN" },
  { id: 7, name: "Australia", flag: "/flags/Australiya.png", code: "AU" },
  { id: 8, name: "China", flag: "/flags/China.jpg", code: "CN" },
  { id: 9, name: "Spain", flag: "/flags/Spain.jpg", code: "ES" },
  { id: 10, name: "Italy", flag: "/flags/Itily.jpg", code: "IT" },
  { id: 11, name: "France", flag: "/flags/France.png", code: "FR" },
  { id: 12, name: "Japan", flag: "/flags/Japan Flag.png", code: "JP" },
]

interface CountryCount {
  country: string
  count: number
}

export default function BrowseByCountry() {
  const router = useRouter()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountryCounts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/events?stats=true&group=country")
        if (!res.ok) throw new Error("Failed to fetch country stats")
        
        const data = await res.json()
        console.log("Country API Response:", data) // Debug log
        
        if (data.countries && Array.isArray(data.countries)) {
          const map: Record<string, number> = {}
          data.countries.forEach((c: CountryCount) => {
            // Normalize country names to match frontend list
            const normalizedCountry = normalizeCountryName(c.country)
            if (normalizedCountry) {
              map[normalizedCountry] = (map[normalizedCountry] || 0) + c.count
            }
          })
          setCounts(map)
        } else {
          console.log("No countries data found in response")
        }
      } catch (error) {
        console.error("Error fetching country stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountryCounts()
  }, [])

  // Helper function to normalize country names
  const normalizeCountryName = (countryName: string): string => {
    if (!countryName) return ''
    
    const normalized = countryName.trim().toLowerCase()
    
    // Map database country names to frontend country names
    const countryMap: Record<string, string> = {
      'india': 'India',
      'usa': 'USA',
      'united states': 'USA',
      'germany': 'Germany',
      'uk': 'UK',
      'united kingdom': 'UK',
      'canada': 'Canada',
      'uae': 'UAE',
      'united arab emirates': 'UAE',
      'australia': 'Australia',
      'china': 'China',
      'spain': 'Spain',
      'italy': 'Italy',
      'france': 'France',
      'japan': 'Japan'
    }

    return countryMap[normalized] || countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase()
  }

  const handleCountryClick = (country: Country) => {
    router.push(`/event?country=${encodeURIComponent(country.name)}`)
  }

  // Helper function to get count for a country
  const getCountryCount = (countryName: string): number => {
    return counts[countryName] || 0
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-12">
        <div className="px-6 py-6 border-b border-gray-200 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Browse Event By Country
          </h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500">Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Browse Event By Country
          </h2>
        </div>

        {/* Country Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            {countries.map((country) => {
              const eventCount = getCountryCount(country.name)
              const formattedCount = eventCount >= 1000
                ? `${(eventCount / 1000).toFixed(1)}k`
                : eventCount

              return (
                <button
                  key={country.id}
                  onClick={() => handleCountryClick(country)}
                  className="group bg-white shadow-sm p-4 hover:shadow-lg hover:shadow-gray-500 transition-all duration-200 hover:scale-105"
                >
                  <div className="aspect-[5/2] flex items-center justify-left">
                    <img
                      src={country.flag || "/placeholder.svg"}
                      alt={`${country.name} flag`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-left mt-2">
                    <p className="font-semibold text-gray-900">
                      {country.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formattedCount} Events
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