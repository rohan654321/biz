import Link from "next/link";
import { CalendarDays, MapPin, Star, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookmarkButton } from "./bookmark-button";
import { ShareButton } from "./share-button";

// 🧩 Fetch data including venue details AND rating (no caching)
async function getFeaturedEvents() {
  const events = await prisma.event.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      title: true,
      startDate: true,
      tags: true,
      edition: true,
      endDate: true,
      bannerImage: true,
      // category: true,
      eventType: true,
      averageRating: true,
      totalReviews: true,
      venue: {
        select: {
          venueName: true,
          venueAddress: true,
          venueCity: true,
          venueCountry: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });

  return events;
}

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  bannerImage?: string;
  // category?: string[];
  edition?: string;
  averageRating?: number;
  totalReviews?: number;
  venue?: {
    venueName?: string;
    venueAddress?: string;
    venueCity?: string;
    venueCountry?: string;
  };
}

export default async function FeaturedEvents() {
  const events = await getFeaturedEvents();

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 mt-12">
      {/* Section Header */}
      <div className="px-6 py-6 border-b border-gray-200 text-left">
        <h2 className="text-3xl font-semibold text-gray-900 mb-1">Featured Events</h2>
        <p className="text-gray-600">Handpicked Popular Events</p>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
        {events.map((event) => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);

          const startFormatter = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            day: "numeric",
          });

          const endFormatter = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const formattedDate = `${startFormatter.format(start)} – ${endFormatter.format(end)}`;

          const venueDisplay =
            event.venue?.venueName || event.venue?.venueCity
              ? `${event.venue?.venueName || ""}, ${event.venue?.venueCity || ""}`
              : "Venue details coming soon";

          const rating = event.averageRating || 4.9;

          return (
            <Link key={event.id} href={`/event/${event.id}`} className="group block">
              <div
                className="flex bg-white border border-gray-200 
                           shadow-sm hover:shadow-md hover:-translate-y-1 
                           transition-all duration-300 overflow-hidden h-[160px] rounded-xl p-3"
              >
                {/* Left: Image */}
                <div className="w-[160px] h-full flex-shrink-0 bg-gray-100">
                  <img
                    src={event.bannerImage || "/herosection-images/food.jpg"}
                    alt={event.title}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>

                {/* Right: Details */}
                <div className="flex-1 flex flex-col justify-between p-4">
                  {/* Title + Actions */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 border border-green-500 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-medium text-green-700">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                      <ShareButton id={event.id} title={event.title} type="event" />
                      <BookmarkButton
                        eventId={event.id}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      />
                    </div>
                  </div>

                  {/* Venue + Edition */}
                  <div className="flex flex-wrap items-center justify-between text-gray-700 text-sm font-medium mt-1">
                    {/* Left side */}
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-700" />
                      {venueDisplay ? venueDisplay.slice(0, 15) : ""}...
                    </span>

                    {/* Right side */}
                    <span className="flex items-center">
                      <Layers className="w-4 h-4 mr-1 text-gray-700" />
                      {event.edition || "1"} edition
                    </span>
                  </div>


                  {/* Date */}
                  <div className="flex items-center text-gray-800 text-sm mt-1">
                    <CalendarDays className="w-4 h-4 mr-1 text-gray-700" />
                    {formattedDate}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="px-2 py-0.5 text-xs font-medium rounded-full 
                                     border border-gray-300 bg-gray-50 text-gray-700">
                      {event.eventType}
                    </div>

                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
