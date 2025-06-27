import { MoreHorizontal } from "lucide-react"

const cities = [
  {
    id: 1,
    name: "Bangalore",
    image: "/city/c5.jpg",
  },
  {
    id: 2,
    name: "New Delhi",
    image: "/city/c4.jpg",
  },
  {
    id: 3,
    name: "Kolkata",
    image: "/city/c3.jpg",
  },
  {
    id: 4,
    name: "Mumbai",
    image: "/city/c2.jpg",
  },
  {
    id: 5,
    name: "Punjab",
    image: "/city/c1.jpg",
  },
]

export default function BrowseByCity() {
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Browse Event By City</h2>
        </div>

        {/* Cities Grid */}
        <div className="p-2">
          {/* First Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {cities.map((city) => (
              <button
                key={city.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={city.image || "/placeholder.svg"}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-80/10 to-transparent"></div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-sm text-center">{city.name}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cities.slice(0, 4).map((city) => (
              <button
                key={`second-${city.id}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={city.image || "/placeholder.svg"}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-80/10 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-semibold text-sm text-center">{city.name}</h3>
                  </div>
                </div>
              </button>
            ))}

            {/* View All Button */}
            <button className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group">
              <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">View All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
