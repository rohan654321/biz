"use client"

import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"


const countries = [
  {
    id: 1,
    name: "United States",
    flag: "/flags/flag1.png",
    events:"22",
    code: "US",
  },
  {
    id: 2,
    name: "Canada",
    flag: "/flags/flag2.png",
    events:"22",
    code: "CA",
  },
  {
    id: 3,
    name: "Germany",
    flag: "/flags/flag3.png",
    events:"22",
    code: "DE",
  },
  {
    id: 4,
    name: "UAE",
    flag: "/flags/flag4.png",
    events:"22",
    code: "AE",
  },
  {
    id: 5,
    name: "United Kingdom",
    flag: "/flags/flag5.png",
    events:"22",
    code: "GB",
  },
  {
    id: 6,
    name: "Australia",
    flag: "/flags/flag6.png",
    events:"22",
    code: "AU",
  },
  {
    id: 7,
    name: "India",
    flag: "/flags/flag7.png",
    events:"22",
    code: "IN",
  },
  {
    id: 8,
    name: "France",
    flag: "/flags/flag8.png",
    events:"22",
    code: "FR",
  },
  {
    id: 9,
    name: "Spain",
    flag: "/flags/flag9.png",
    events:"22",
    code: "ES",
  },
  {
    id: 10,
    name: "India",
    flag: "/flags/flag7.png",
    events:"22",
    code: "IN",
  },
  {
    id: 11,
    name: "France",
    flag: "/flags/flag8.png",
    events:"22",
    code: "FR",
  },
  // {
  //   id: 9,
  //   name: "Spain",
  //   flag: "/flags/flag9.png",
  //   code: "ES",
  // },
]

export default function BrowseByCountry() {
  const router = useRouter()

  const handleCountryClick = (country: (typeof countries)[0]) => {
    // Navigate to events page filtered by country
    router.push(`/event?country=${encodeURIComponent(country.name)}`)
  }

  const handleViewAllClick = () => {
    // Navigate to all events
    router.push("/event")
  }
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Browse Event By Country</h2>
        </div>

        {/* Countries Grid */}
        <div className="p-6">
          {/* First Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountryClick(country)}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-[5/2] flex items-center justify-center">
                  <img
                    src={country.flag || "/placeholder.svg"}
                    alt={`${country.name} flag`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                
                </div>
                <p>{country.events} events</p>
              </button>
            ))}
            <button 
              onClick={handleViewAllClick}
            className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group p-4">
              <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">View All</span>
            </button>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* {countries.slice(5, 9).map((country) => (
              <button
                key={country.id}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-[5/2] flex items-center justify-center">
                  <img
                    src={country.flag || "/placeholder.svg"}
                    alt={`${country.name} flag`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              </button>
            ))} */}

            {/* View All Button */}
            
          </div>
        </div>
      </div>
    </div>
  )
}
