import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Plus, Bookmark, Share2, Users } from "lucide-react"
import type { Event } from "@/lib/data/events"
import Image from "next/image"
import { Shield, Clock, Ticket } from "lucide-react"

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
     <div className="">
      {/* Background Image with Gradient Overlay */}
      <div className=" relative w-full h-[300px] md:h-[300px]">
        <img
          src={getMainImage()}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/20" />   */}
      </div>

      {/* Main Image & Floating Card */}
      <div className="absulate w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] relative z-10">
      {/* Left: Event Image */}
      <div className="relative md:w-2/3 w-full h-[600px] md:h-[300px]">
        <Image
          src="/images/gpex.jpg" // Update this to your actual image path
          alt="Event Image"
          fill
          className=""
        />
      </div>

      {/* Right: Info Section */}
      <div className="md:w-2/4 w-full bg-blue-50 p-6 flex flex-col justify-center space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-md text-gray-600">India’s Largest</p>
          <Shield className="w-5 h-5 text-gray-500" />
        </div>

        <h2 className="text-2xl font-semibold text-black leading-snug ">
          Die & Mould Exhibition
        </h2>

        <div className="space-y-4 text-sm text-gray-800 py-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-black" />
            <span>11 – 13 June, 2025</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-black" />
            <span>10:00am – 06:00pm</span>
          </div>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-black" />
            <span>Free Entry</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-black" />
            <span>3032 Followers</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}