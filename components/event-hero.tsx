import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Plus, Bookmark, Share2, Users } from "lucide-react"
import type { Event } from "@/lib/data/events"

interface EventHeroProps {
  event: Event
}

export default function EventHero({ event }: EventHeroProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getMainImage = () => {
    const mainImage = event.images.find((img) => img.type === "main")
    return mainImage?.url || "/placeholder.svg?height=400&width=1200&text=Event+Background"
  }

  return (
    <div className="relative min-h-[300px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={getMainImage() || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="relative top-30 bg-white rounded-md p-6 grid grid-cols-1 lg:grid-cols-12 gap- items-start ">
          {/* Left Content Card */}
          <div className="lg:col-span-5">
            <div className="">
              <CardContent className="p-6 space-y-4">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {event.isVerified && (
                    <Badge className="bg-[#002c71] text-white hover:bg-blue-700">
                      <div className="w-3 h-3 bg-white rounded-full mr-1 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#002c71] rounded-full" />
                      </div>
                      VERIFIED
                    </Badge>
                  )}
                 
                </div>

                {/* Event Title */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#002c71] mb-2">{event.title}</h1>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{event.categories}</p>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="font-medium">
                    {formatDate(event.timings.startDate)} - {formatDate(event.timings.endDate)}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{event.location.venue}</div>
                    {/* <div className="text-sm text-gray-600">{event.location.address}</div> */}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50">
                    <Plus className="w-4 h-4" />
                    Get Directions
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                  >
                    <Bookmark className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Center Stats Card */}
          <div className="lg:col-span-4 hidden lg:block mr-5 ml-10">
            <img src={getMainImage() || "/placeholder.svg"} alt={event.title} className="w-[500px] h-50 mt-5   rounded-lg" />
          </div>

          {/* Right Interest Card */}
          <div className="lg:col-span-3">
            <div className="bg-white">
              <CardContent className="pt-14 text-center space-y-4">
                <p className="text-gray-700 font-medium">Interested in this Event?</p>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">Visit</Button>
                  <Button className="flex-1 bg-[#002c71] hover:bg-blue-700 text-white">Exhibit</Button>
                </div>

                {/* Organizer Info */}
                {/* <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={event.organizer.avatar || "/placeholder.svg"}
                      alt={event.organizer.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-medium text-sm">{event.organizer.name}</div>
                      <div className="text-xs text-gray-600">{event.organizer.description}</div>
                    </div>
                  </div>
                </div> */}

                {/* Followers */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center"
                      >
                        <Users className="w-3 h-3 text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[#002c71] font-semibold text-sm">
                    {event.followers?.toLocaleString() || 0} Followers
                  </span>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}