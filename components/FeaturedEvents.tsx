import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function getFeaturedEvents() {
  const events = await prisma.event.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      title: true,
      startDate: true,
      bannerImage: true,
      images: true,
      category: true,
    },
    orderBy: { startDate: "asc" },
  });

  return events;
}

interface Event {
  id: string;
  title: string;
  startDate: string;
  bannerImage?: string;
  category?: string;
}

export default async function FeaturedEvents() {
  const events = await getFeaturedEvents();

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 mt-12">
      {/* Section Header */}
      <div className="px-6 py-6 border-b border-gray-200 text-left">
        <h2 className="text-3xl font-semibold text-gray-900 mb-1">
          Featured Events
        </h2>
        <p className="text-gray-600">Handpicked Popular Events</p>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group block"
          >
            <div
              className="bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl 
                         p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 
                         transition-all duration-300"
            >
              {/* Top Section */}
              <div className="flex items-start gap-4">
                {/* Event Image — Full (No Background Box) */}
                <div className="w-[120px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={event.bannerImage || "/herosection-images/food.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Info */}
                <div className="flex flex-col text-left">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    International Exhibition
                  </p>

                  <div className="flex items-center text-sm font-semibold text-gray-800">
                    <CalendarDays className="w-4 h-4 mr-2 text-gray-700" />
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-700 mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-blue-700" />
                    Chennai Trade Centre, India
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300"></div>

              {/* Tags / Categories */}
              <div className="flex gap-2 flex-wrap">
                <span
                  className="px-3 py-1 text-sm rounded-full border border-gray-400 
                             bg-white/70 text-gray-800"
                >
                  {event.category || "General"}
                </span>
                <span
                  className="px-3 py-1 text-sm rounded-full border border-gray-400 
                             bg-white/70 text-gray-800"
                >
                  Power & Energy
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
