"use client"

import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

const countries = [
  { id: 1, name: "USA", flag: "/flags/USA.png", events: "263.6k", code: "US" },
  { id: 2, name: "Germany", flag: "/flags/Germany.png", events: "37.0k", code: "DE" },
  { id: 3, name: "UK", flag: "/flags/UK.png", events: "60.0k", code: "GB" },
  { id: 4, name: "Canada", flag: "/flags/Canada.png", events: "25.3k", code: "CA" },
  { id: 5, name: "UAE", flag: "/flags/UAE.png", events: "10.3k", code: "AE" },
  
  { id: 6, name: "India", flag: "/flags/India.png", events: "31.1k", code: "IN" },
    { id: 7, name: "Australia", flag: "/flags/Australiya.png", events: "24.3k", code: "AU" },
      { id: 8, name: "China", flag: "/flags/China.jpg", events: "17.8k", code: "CN" },
  { id: 9, name: "Spain", flag: "/flags/Spain.jpg", events: "12.4k", code: "ES" },
    { id: 10, name: "Italy", flag: "/flags/Itily.jpg", events: "13.7k", code: "IT" },
  { id: 11, name: "France", flag: "/flags/France.png", events: "14.6k", code: "FR" },


  { id: 12, name: "Japan", flag: "/flags/Japan Flag.png", events: "11.9k", code: "NL" },

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
    router.push(`/event?country=${encodeURIComponent(country.name)}`)
  }

  const handleViewAllClick = () => {
    router.push("/event")
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

        {/* Countries Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountryClick(country)}
                className="group bg-white shadow-sm  p-4 hover:shadow-lg hover:shadow-gray-500 transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-[5/2] flex items-center justify-left">
                  <img
                    src={country.flag || "/placeholder.svg"}
                    alt={`${country.name} flag`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-left mt-2">
                  <p className="font-semibold text-gray-900">{country.name}</p>
                  <p className="text-sm text-gray-500">{country.events} Events</p>
                </div>
              </button>
            ))}
            {/* <button
              onClick={handleViewAllClick}
              className="aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group p-4"
            >
              <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                View All
              </span>
            </button> */}
          </div>

          {/* Second Row (comment kept as requested) */}
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
        </div>
      </div>
    </div>
  )
}

