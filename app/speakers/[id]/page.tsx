import Image from "next/image"
import { Calendar, Clock, Ticket, Users } from "lucide-react"



export default async function SpeakerPage() {

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div>
      {/* Background Image */}
      <div className="relative w-full h-[300px]">
        <img
          src="/images/gpex.jpg"
          alt="Event Background"
          width={1200}
          className="w-full h-full"
        />
      </div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row mt-[-150px] md:mt-[-120px] z-10 left-1/2 lg:left-145 -translate-x-1/2">

        {/* Slider Left */}
        <Image

            src="/images/gpex.jpg"
            alt="Event Image"
            width={800}
            height={300}
            className="md:w-1/3 w-full h-[400px] object-cover"
        />

        {/* Right Info */}
        <div className="md:w-4/3 w-full bg-blue-50 p-6 flex flex-col justify-center space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-md text-gray-800 font-bold">India’s Largest</p>
            <Image
              src="/images/verified.png"
              alt="Verified"
              width={40}
              height={40}
              className="w-8 h-8"
            />
          </div>

          <h2 className="text-2xl font-semibold text-black leading-snug">
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
      
    </div>
  )
}
