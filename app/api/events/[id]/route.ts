import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("[v0] Fetching event details for ID:", (await params).id)

    const { id } = await params

    // Validate ObjectID format
    if (!id || id.length !== 24) {
      console.log("[v0] Invalid event ID format:", id)
      return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 })
    }

    // Fetch event with all related data
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            company: true,
            description: true,
            businessEmail: true,
            businessPhone: true,
          },
        },
        venue: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            venueName: true,
            venueAddress: true,
            venueCity: true,
            venueState: true,
            venueCountry: true,
            venuePhone: true,
            venueEmail: true,
            maxCapacity: true,
            amenities: true,
            venueImages: true,
            averageRating: true,
            totalReviews: true,
          },
        },
        exhibitorBooths: {
          include: {
            exhibitor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                avatar: true,
                email: true,
                phone: true,
              },
            },
            space: true,
          },
        },
        speakerSessions: {
          include: {
            speaker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                avatar: true,
                bio: true,
                linkedin: true,
                twitter: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        exhibitionSpaces: true,
        registrations: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!event) {
      console.log("[v0] Event not found:", id)
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    console.log("[v0] Event found:", event.title)

    // Transform data to match frontend expectations
    const transformedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription,
      slug: event.slug,
      status: event.status,
      category: event.category,
      categories: event.eventType || [],
      tags: event.tags,

      // Dates
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      registrationStart: event.registrationStart.toISOString(),
      registrationEnd: event.registrationEnd.toISOString(),
      timezone: event.timezone,

      // Location
      location: {
        venue: event.venue?.venueName || "TBD",
        address: event.address || event.venue?.venueAddress || "",
        city: event.city || event.venue?.venueCity || "",
        state: event.state || event.venue?.venueState || "",
        country: event.country || event.venue?.venueCountry || "",
        zipCode: event.zipCode || "",
      },

      // Media
      images: event.images || [],
      videos: event.videos || [],
      bannerImage: event.bannerImage,
      thumbnailImage: event.thumbnailImage,

      // Capacity and Pricing
      maxAttendees: event.maxAttendees,
      currentAttendees: event.currentAttendees,
      ticketTypes: event.ticketTypes || [],
      currency: event.currency,

      // Computed pricing for compatibility
      pricing: {
        currency: event.currency,
        general: event.ticketTypes?.find((t) => t.name.toLowerCase().includes("general"))?.price || 0,
        student: event.ticketTypes?.find((t) => t.name.toLowerCase().includes("student"))?.price,
        vip: event.ticketTypes?.find((t) => t.name.toLowerCase().includes("vip"))?.price,
      },

      // Stats
      stats: {
        duration: `${Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`,
        attendees: event.currentAttendees,
        exhibitors: event.exhibitorBooths?.length || 0,
        speakers: event.speakerSessions?.length || 0,
      },

      // Timings
      timings: {
        dailyStart: "09:00 AM",
        dailyEnd: "06:00 PM",
        timezone: event.timezone,
      },

      // Organizer
      organizer: {
        id: event.organizer.id,
        name: `${event.organizer.firstName} ${event.organizer.lastName}`,
        email: event.organizer.businessEmail || event.organizer.email,
        phone: event.organizer.businessPhone || event.organizer.phone,
        avatar: event.organizer.avatar,
        description: event.organizer.description || event.organizer.company || "",
      },

      // Exhibition spaces and costs
      exhibitSpaceCosts:
        event.exhibitionSpaces?.map((space) => ({
          type: space.spaceType,
          description: space.description,
          pricePerSqm: space.basePrice,
          minArea: space.area,
        })) || [],

      // Exhibitors
      exhibitors:
        event.exhibitorBooths?.map((booth) => ({
          id: booth.exhibitor.id,
          company:
            booth.companyName || booth.exhibitor.company || `${booth.exhibitor.firstName} ${booth.exhibitor.lastName}`,
          img: booth.exhibitor.avatar,
          email: booth.exhibitor.email,
          phone: booth.exhibitor.phone,
          boothNumber: booth.boothNumber,
        })) || [],

      // Speakers
      speakers:
        event.speakerSessions?.map((session) => ({
          id: session.speaker.id,
          name: `${session.speaker.firstName} ${session.speaker.lastName}`,
          company: session.speaker.company,
          img: session.speaker.avatar,
          bio: session.speaker.bio,
          linkedin: session.speaker.linkedin,
          twitter: session.speaker.twitter,
          sessionTitle: session.title,
          sessionDescription: session.description,
        })) || [],

      // Followers (registered attendees)
      followers:
        event.registrations?.map((reg) => ({
          id: reg.user.id,
          name: `${reg.user.firstName} ${reg.user.lastName}`,
          company: reg.user.company,
          img: reg.user.avatar,
          location: "", // Not available in current schema
        })) || [],

      // Reviews and Rating
      rating: {
        average:
          event.reviews?.length > 0
            ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / event.reviews.length
            : 0,
        count: event.reviews?.length || 0,
      },

      // Mock data for features not in schema yet
      highlights: [
        "Industry Leading Exhibitors",
        "Expert Speaker Sessions",
        "Networking Opportunities",
        "Latest Technology Showcase",
      ],
      dressCode: "Business Casual",
      ageLimit: "All ages welcome",
      featuredItems: [],
      touristAttractions: [],

      // Settings
      isPublic: event.isPublic,
      requiresApproval: event.requiresApproval,
      allowWaitlist: event.allowWaitlist,

      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error("[v0] Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event details" }, { status: 500 })
  }
}
