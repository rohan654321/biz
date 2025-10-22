import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// --- Define types for clarity ---
interface EventResult {
  id: string
  title: string
  slug: string
  category: string | null // ✅ changed from string → string | null
  startDate: Date
  endDate: Date
  isFeatured: boolean | null
  isVIP: boolean | null
  venue: {
    id: string
    venueName: string | null
    venueCity: string | null
    venueCountry: string | null
  } | null
  type: "event"
  spotsRemaining: number | null
  isRegistrationOpen: boolean
  [key: string]: any
}

interface VenueResult {
  id: string
  venueName: string | null
  venueCity: string | null
  venueState: string | null
  venueCountry: string | null
  location: string
  displayName: string | null
  type: "venue"
  [key: string]: any
}

interface SpeakerResult {
  id: string
  firstName: string
  lastName: string
  displayName: string
  expertise: string[]
  type: "speaker"
  [key: string]: any
}

interface SearchResults {
  events: EventResult[]
  venues: VenueResult[]
  speakers: SpeakerResult[]
  allResults: (EventResult | VenueResult | SpeakerResult)[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = parseInt(searchParams.get("limit") || "5")
    const type = searchParams.get("type") || "all"

    if (!query.trim()) {
      const empty: SearchResults = { events: [], venues: [], speakers: [], allResults: [] }
      return NextResponse.json(empty, { status: 200 })
    }

    // ✅ Explicitly typed initial object
    const searchResults: SearchResults = {
      events: [],
      venues: [],
      speakers: [],
      allResults: [],
    }

    // Search Events
    if (type === "all" || type === "events") {
      const events = await prisma.event.findMany({
        where: {
          isPublic: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { tags: { has: query } },
            { 
              venue: { 
                venueName: { contains: query, mode: "insensitive" }
              }
            },
            {
              venue: {
                venueCity: { contains: query, mode: "insensitive" }
              }
            },
            {
              venue: {
                venueCountry: { contains: query, mode: "insensitive" }
              }
            }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          shortDescription: true,
          slug: true,
          category: true,
          tags: true,
          eventType: true,
          isFeatured: true,
          isVIP: true,
          startDate: true,
          endDate: true,
          timezone: true,
          isVirtual: true,
          virtualLink: true,
          maxAttendees: true,
          currentAttendees: true,
          ticketTypes: true,
          currency: true,
          images: true,
          bannerImage: true,
          thumbnailImage: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              avatar: true,
            },
          },
          venue: {
            select: {
              id: true,
              venueName: true,
              venueAddress: true,
              venueCity: true,
              venueState: true,
              venueCountry: true,
            },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
        take: limit,
        orderBy: {
          startDate: "asc",
        },
      })

     searchResults.events = events.map((event) => ({
  ...event,
  category: event.category ?? "Uncategorized", // default fallback
  type: "event",
  spotsRemaining: event.maxAttendees
    ? event.maxAttendees - event._count.registrations
    : null,
  isRegistrationOpen: true,
}))

    }

    // Search Venues
    if (type === "all" || type === "venues") {
      const venues = await prisma.user.findMany({
        where: {
          role: "VENUE_MANAGER",
          isActive: true,
          OR: [
            { venueName: { contains: query, mode: "insensitive" } },
            { venueDescription: { contains: query, mode: "insensitive" } },
            { venueAddress: { contains: query, mode: "insensitive" } },
            { venueCity: { contains: query, mode: "insensitive" } },
            { venueState: { contains: query, mode: "insensitive" } },
            { venueCountry: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          venueName: true,
          venueDescription: true,
          venueAddress: true,
          venueCity: true,
          venueState: true,
          venueCountry: true,
          venueZipCode: true,
          maxCapacity: true,
          totalHalls: true,
          amenities: true,
          averageRating: true,
          totalReviews: true,
          createdAt: true,
        },
        take: limit,
        orderBy: {
          averageRating: "desc",
        },
      })

      searchResults.venues = venues.map((venue) => ({
        ...venue,
        type: 'venue',
        displayName: venue.venueName,
        location: [venue.venueCity, venue.venueState, venue.venueCountry].filter(Boolean).join(', '),
      }))
    }

    // Search Speakers
    if (type === "all" || type === "speakers") {
      const speakers = await prisma.user.findMany({
        where: {
          role: "SPEAKER",
          isActive: true,
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { jobTitle: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
            { specialties: { hasSome: [query] } },
            { location: { contains: query, mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          bio: true,
          company: true,
          jobTitle: true,
          location: true,
          website: true,
          linkedin: true,
          twitter: true,
          specialties: true,
          achievements: true,
          certifications: true,
          speakingExperience: true,
          isVerified: true,
          totalEvents: true,
          averageRating: true,
          totalReviews: true,
          createdAt: true,
        },
        take: limit,
        orderBy: {
          totalEvents: "desc",
        },
      })

      searchResults.speakers = speakers.map((speaker) => ({
        ...speaker,
        type: 'speaker',
        displayName: `${speaker.firstName} ${speaker.lastName}`,
        expertise: speaker.specialties?.slice(0, 3) || [],
      }))
    }

    // Combine all results for unified search
    searchResults.allResults = [
      ...searchResults.events.map(event => ({ ...event, resultType: 'event' })),
      ...searchResults.venues.map(venue => ({ ...venue, resultType: 'venue' })),
      ...searchResults.speakers.map(speaker => ({ ...speaker, resultType: 'speaker' }))
    ].slice(0, limit * 3) // Limit combined results

    return NextResponse.json(searchResults, { status: 200 })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}