"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import HorizontalScroller from "@/components/HorizontalScroller";

interface Venue {
  venueName?: string | null;
  venueAddress?: string | null;
  venueCity?: string | null;
  venueCountry?: string | null;
}

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  bannerImage?: string | null;
  images?: string[] | null;
  venue?: Venue | null;
}

const EventCard = ({ event }: { event: Event }) => {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;

  const date = start.getDate().toString();
  const endDate =
    end && end.getDate() !== start.getDate() ? end.getDate().toString() : undefined;
  const month = start.toLocaleString("default", { month: "short" });
  const year = start.getFullYear().toString();

  // FIXED: Include venueAddress like in the original server component
  const location = event.venue
    ? [
        event.venue.venueAddress, // Added this back
        event.venue.venueCity, 
        event.venue.venueCountry,
      ]
      .filter(Boolean)
      .join(", ")
    : "Venue coming soon";

  return (
    <Link href={`/event/${event.id}`}>
      <div className="flex-shrink-0 w-80 h-[480px] bg-[#F2F2F2] relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 snap-start">
        <img
          src={event.bannerImage || event.images?.[0] || "/herosection-images/food.jpg"}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-20/5 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-20 bg-white/95 backdrop-blur-sm rounded-sm py-3 shadow-lg mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {endDate ? `${date}–${endDate}` : date}
              </div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {month}
              </div>
              <div className="text-xs text-gray-500">{year}</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 leading-tight">{event.title}</h3>

          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function HeroSlideshowClient({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔁 Auto-refresh every 30s for near real-time updates
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsRefreshing(true);
        const res = await fetch("/api/events?vip=true", { cache: "no-store" });
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error refreshing events:", err);
      } finally {
        setIsRefreshing(false);
      }
    };

    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!events.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No VIP Events Found
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="relative mx-auto px-4">
        {isRefreshing && (
          <div className="absolute top-0 right-4 text-xs text-gray-400 animate-pulse">
            Updating...
          </div>
        )}
        <HorizontalScroller>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </HorizontalScroller>
      </div>
    </div>
  );
}