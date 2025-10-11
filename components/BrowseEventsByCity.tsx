"use client"

import { MoreHorizontal, Building2, Landmark, Building, Castle, Mountain, TreePine, Crown, Church, Waves, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const cities = [
  {
    id: 1,
    name: "Amsterdam",
    icon: "/icon/Amsterdam.png",
    events: "44",
    color: "text-blue-600"
  },
  {
    id: 2,
    name: "Berlin",
    icon: "/icon/berlin.png",
    events: "44",
    color: "text-red-600"
  },
  {
    id: 3,
    name: "Dubai",
    icon: "/icon/Dubai.png",
    events: "44",
    color: "text-yellow-600"
  },
  {
    id: 4,
    name: "Egypt",
    icon: "/icon/egypt-01.png",
    events: "44",
    color: "text-purple-600"
  },
  {
    id: 5,
    name: "Italy",
    icon: "/icon/italy-01.png",
    events: "44",
    color: "text-green-600"
  },
  {
    id: 6,
    name: "Japan",
    icon: "/icon/Japan-01.png",
    events: "44",
    color: "text-blue-600"
  },
  {
    id: 7,
    name: "London",
    icon: "/icon/London-01.png",
    events: "44",
    color: "text-red-600"
  },
  {
    id: 8,
    name: "Kolkata",
    icon: "/icon/city.png",
    events: "44",
    color: "text-yellow-600"
  },
  {
    id: 9,
    name: "New York",
    icon: "/icon/new york-01.png",
    events: "44",
    color: "text-purple-600"
  },
  {
    id: 10,
    name: "Paris",
    icon: "/icon/paris-01.png",
    events: "44",
    color: "text-green-600"
  },
  {
    id: 11,
    name: "Rome",
    icon: "/icon/Rome-01.png",
    events: "44",
    color: "text-purple-600"
  },
    {
    id: 12,
    name: "Russia",
    icon: "/icon/Russia-01.png",
    events: "44",
    color: "text-purple-600"
  },
]


export default function BrowseByCity() {
  const router = useRouter()

  const handleCityClick = (city: (typeof cities)[0]) => {
    router.push(`/event?location=${encodeURIComponent(city.name)}`)
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
            Browse Event By City
          </h2>
        </div>

        {/* Cities Grid */}
        <div className="p-2">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                className="group relative overflow-hidden  border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white aspect-[4/3] flex flex-col items-center justify-center p-4"
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
                  <h3 className="text-gray-900 font-semibold text-sm mb-1">{city.name}</h3>
                  <p className="text-gray-500 text-xs">{city.events} events</p>
                </div>
              </button>
            ))}

            {/* View All Button (same size as others) */}
            {/* <button
              onClick={handleViewAllClick}
              className="aspect-[4/3] flex flex-col items-center justify-center border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-105 bg-gray-50"
            >
              <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                View All
              </span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
// "use client"

// import { MoreHorizontal } from "lucide-react"
// import { useRouter } from "next/navigation"

// const cities = [
//   {
//     id: 1,
//     name: "Bangalore",
//     image: "/city/c5.jpg",
//     events:"44"
//   },
//   {
//     id: 2,
//     name: "New Delhi",
//     image: "/city/c4.jpg",
//      events:"44"
//   },
//   {
//     id: 3,
//     name: "Kolkata",
//     image: "/city/c3.jpg",
//      events:"44"
//   },
//   {
//     id: 4,
//     name: "Mumbai",
//     image: "/city/c2.jpg",
//      events:"44"
//   },
//   {
//     id: 5,
//     name: "Punjab",
//     image: "/city/c1.jpg",
//      events:"44"
//   },
//   {
//     id: 6,
//     name: "Bangalore",
//     image: "/city/c5.jpg",
//      events:"44"
//   },
//   {
//     id: 7,
//     name: "New Delhi",
//     image: "/city/c4.jpg",
//      events:"44"
//   },
//   {
//     id: 8,
//     name: "Kolkata",
//     image: "/city/c3.jpg",
//      events:"44"
//   },
//   {
//     id: 9,
//     name: "Mumbai",
//     image: "/city/c2.jpg",
//      events:"44"
//   },
//   {
//     id: 10,
//     name: "Punjab",
//     image: "/city/c1.jpg",
//      events:"44"
//   },
//    {
//     id: 11,
//     name: "Mumbai",
//     image: "/city/c2.jpg",
//      events:"44"
//   },
//   // {
//   //   id: 12,
//   //   name: "Punjab",
//   //   image: "/city/c1.jpg",
//   // },
// ]

// export default function BrowseByCity() {
//   const router = useRouter()

//   const handleCityClick = (city: (typeof cities)[0]) => {
//     // Navigate to events page filtered by city
//     router.push(`/event?location=${encodeURIComponent(city.name )}`)
//   }

//   const handleViewAllClick = () => {
//     // Navigate to all events
//     router.push("/event")
//   }
//   return (
//     <div className="w-full max-w-6xl mx-auto mb-12">
//       <div className="overflow-hidden">
//         {/* Header */}
//        <div className="px-6 py-6 border-b border-gray-200 text-left">
//   <h2 className="text-3xl font-semibold text-gray-900 mb-1">
//     Browse Event By City
//   </h2>
// </div>


//         {/* Cities Grid */}
//         <div className="p-2">
//           {/* First Row */}
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
//             {cities.map((city) => (
//               <button
//                 key={city.id}
//                 onClick={() => handleCityClick(city)}
//                 className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
//               >
//                 <div className="aspect-[4/3] relative">
//                   <img
//                     src={city.image || "/placeholder.svg"}
//                     alt={city.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-80/10 to-transparent"></div>

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                   <div className="absolute bottom-2 left-2 right-2">
//                     <h3 className="text-white font-semibold text-sm text-center">{city.name}</h3>
//                     <p className="text-white font-semibold text-sm text-center">{city.events} events</p>
//                   </div>
//                 </div>
//               </button>
              
//             ))}
//             <button
//              onClick={handleViewAllClick}
//              className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center group">
//               <MoreHorizontal className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
//               <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">View All</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }