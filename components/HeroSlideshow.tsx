import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import HorizontalScroller from "@/components/HorizontalScroller"  // ✅ import new component

export async function getVipEvents() {
  const events = await prisma.event.findMany({
    where: { isVIP: true },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true, // ✅ Add this line
      bannerImage: true,
      images: true,
    },
    orderBy: { startDate: "asc" },
  })

  return events
}


interface EventCardProps {
  imageSrc: string
  date: string
  month: string
  year: string
  title: string
  location?: string | null
}

const EventCard = ({ imageSrc, date, month, year, title, location, endDate }: EventCardProps & { endDate?: string }) => {
  return (
    <div className="flex-shrink-0 w-80 h-[480px] bg-[#F2F2F2] relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 snap-start">
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-20/5 to-transparent"></div>

      {/* Date box */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-20 bg-white/95 backdrop-blur-sm rounded-sm py-3 shadow-lg mb-4">
          <div className="text-center">
            {/* 👇 Show start–end day range */}
            <div className="text-2xl font-bold text-gray-900">
              {endDate && endDate !== date ? `${date}–${endDate}` : date}
            </div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{month}</div>
            <div className="text-xs text-gray-500">{year}</div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
        {location && (
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        )}
        <div className="flex items-center text-white/60 text-xs mt-2">
          <MapPin className="w-3 h-3 mr-1" />
          Event Location
        </div>
      </div>
    </div>
  )
}


export default async function HeroSlideshow() {
  const events = await getVipEvents() // SSG

  return (
    <div className="bg-white">
      <div className="relative mx-auto px-4">
        <HorizontalScroller>
          {events.map((event) => (
         <Link href={`/event/${event.id}`} key={event.id}>
  <EventCard
    imageSrc={event.bannerImage || event.images?.[0] || "/herosection-images/food.jpg"}
    date={new Date(event.startDate).getDate().toString()}
    endDate={
      event.endDate
        ? new Date(event.endDate).getDate().toString()
        : undefined
    } // ✅ Add this
    month={new Date(event.startDate).toLocaleString("default", { month: "short" })}
    year={new Date(event.startDate).getFullYear().toString()}
    title={event.title}
    // location={event.location}
  />
</Link>

          ))}
        </HorizontalScroller>
      </div>
    </div>
  )
}
