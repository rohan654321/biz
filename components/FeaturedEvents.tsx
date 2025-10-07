// app/components/FeaturedEvents.tsx
import Link from "next/link"
import { Calendar, Share2 } from "lucide-react"
import { prisma } from "@/lib/prisma"
// import { events } from "@/lib/data/events"

// Fetch featured events at build time
export async function getFeaturedEvents() {
  const events = await prisma.event.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      title: true,
      startDate: true,
      bannerImage: true,
      images: true,
     
      category:true,
    },
    orderBy: { startDate: "asc" },
  })

  return events
}


interface Event {
  id: string
  title: string
  startDate: string
  logo?: string
  categories?: string
  bannerImage?: string
}



export default async function FeaturedEvents() {
  const events =await  getFeaturedEvents()
    return (
    <div className="w-full max-w-6xl mx-auto mb-12 mt-12">
      <div className="px-6 py-6 border-b border-gray-200 text-left">
        <h2 className="text-3xl font-semibold text-gray-900 mb-1">Featured Events</h2>
        <p className="text-gray-600">Handpicked Popular Events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`} className="group">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-400">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 border border-gray-200 overflow-hidden">
                  <img
                    src={event.bannerImage || "/herosection-images/food.jpg"}
                    alt={event.title}
                    className="w-14 h-14 object-cover rounded-4xl"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  {event.category || "General"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
