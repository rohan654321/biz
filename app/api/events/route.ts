import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth/next"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePrivate = searchParams.get("includePrivate") === "true"
    const featuredOnly = searchParams.get("featured") === "true"
    const vipOnly = searchParams.get("vip") === "true"
    const statsOnly = searchParams.get("stats") === "true"
    const groupBy = searchParams.get("group")

    // ✅ Handle country statistics request
    if (statsOnly && groupBy === "country") {
      const eventsWithVenues = await prisma.event.findMany({
        where: { 
          isPublic: true,
          venueId: { not: null }
        },
        include: {
          venue: {
            select: {
              venueCountry: true
            }
          }
        }
      })

      // Count events by country
      const countryCounts: Record<string, number> = {}
      
      eventsWithVenues.forEach(event => {
        if (event.venue?.venueCountry) {
          const country = event.venue.venueCountry.trim()
          if (country) {
            countryCounts[country] = (countryCounts[country] || 0) + 1
          }
        }
      })

      // Convert to array format for frontend
      const countries = Object.entries(countryCounts).map(([country, count]) => ({
        country,
        count
      }))

      return NextResponse.json({ countries }, { status: 200 })
    }

    // ✅ Handle city statistics request
    if (statsOnly && groupBy === "city") {
      const eventsWithVenues = await prisma.event.findMany({
        where: { 
          isPublic: true,
          venueId: { not: null }
        },
        include: {
          venue: {
            select: {
              venueName: true, // Add venueName to the select
              venueCity: true,
              venueState: true,
              venueCountry: true
            }
          }
        }
      })

      // Count events by city/state
      const cityCounts: Record<string, number> = {}
      
      eventsWithVenues.forEach(event => {
        if (event.venue) {
          // Use venueCity first, then venueState
          let location = event.venue.venueCity || event.venue.venueState
          
          // If no city/state, try to extract from venueName
          if (!location && event.venue.venueName) {
            // Simple extraction - you might want to improve this logic
            const name = event.venue.venueName.toLowerCase()
            if (name.includes('london')) location = 'London'
            else if (name.includes('dubai')) location = 'Dubai'
            else if (name.includes('berlin')) location = 'Berlin'
            else if (name.includes('amsterdam')) location = 'Amsterdam'
            else if (name.includes('paris')) location = 'Paris'
            else if (name.includes('washington')) location = 'Washington DC'
            else if (name.includes('new york')) location = 'New York'
            else if (name.includes('barcelona')) location = 'Barcelona'
            else if (name.includes('kuala')) location = 'Kuala Lumpur'
            else if (name.includes('orlando')) location = 'Orlando'
            else if (name.includes('chicago')) location = 'Chicago'
            else if (name.includes('munich')) location = 'Munich'
            else if (name.includes('chennai')) location = 'Chennai'
            else if (name.includes('mumbai')) location = 'Mumbai'
          }

          if (location && location.trim()) {
            const locationName = location.trim()
            cityCounts[locationName] = (cityCounts[locationName] || 0) + 1
          }
        }
      })

      // Convert to array format for frontend
      const cities = Object.entries(cityCounts).map(([city, count]) => ({
        city,
        count
      }))

      return NextResponse.json({ cities }, { status: 200 })
    }

    // ✅ Handle category statistics request
    if (statsOnly) {
      const allEvents = await prisma.event.findMany({
        where: { isPublic: true },
        select: { category: true }
      })

      // Flatten all categories and count occurrences
      const categoryCounts: Record<string, number> = {}
      
      allEvents.forEach(event => {
        if (event.category && Array.isArray(event.category)) {
          event.category.forEach(cat => {
            if (cat && typeof cat === 'string') {
              // Handle both array categories and comma-separated strings
              if (cat.includes(',')) {
                // Split comma-separated categories
                cat.split(',').forEach(singleCat => {
                  const categoryName = singleCat.trim()
                  if (categoryName) {
                    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
                  }
                })
              } else {
                const categoryName = cat.trim()
                categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
              }
            }
          })
        }
      })

      // Convert to array format for frontend
      const categories = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count
      }))

      return NextResponse.json({ categories }, { status: 200 })
    }

    // Check if requesting private data
    if (includePrivate) {
      const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Build where clause for private events
      const privateWhereClause = {
        OR: [{ organizerId: session.user?.id }, { isPublic: true }],
        ...(featuredOnly && { isFeatured: true }),
        ...(vipOnly && { isVIP: true }),
      }

      // Get all events for authenticated users (organizers can see their own events)
      const events = await prisma.event.findMany({
        where: privateWhereClause,
        include: {
          exhibitionSpaces: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              email: true,
              company: true,
              avatar: true,
            },
          },
          venue: true,
          registrations: {
            select: {
              id: true,
              status: true,
              registeredAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
        orderBy: {
          startDate: "asc",
        },
      })

      return NextResponse.json({ events }, { status: 200 })
    }

    // Build where clause for public events
    const publicWhereClause = {
      isPublic: true,
      ...(featuredOnly && { isFeatured: true }),
      ...(vipOnly && { isVIP: true }),
    }

    // Public events data (no authentication required)
    const events = await prisma.event.findMany({
      where: publicWhereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDescription: true,
        status: true,
        category: true,
        tags: true,
        eventType: true,
        isFeatured: true,  
        isVIP: true,       
        startDate: true,
        endDate: true,
        registrationStart: true,
        registrationEnd: true,
        timezone: true,
        isVirtual: true,
        virtualLink: true,
        maxAttendees: true,
        currentAttendees: true,
        ticketTypes: true,
        currency: true,
        images: true,
        videos: true,
        leads: true,
        documents: true,
        bannerImage: true,
        thumbnailImage: true,
        isPublic: true,
        requiresApproval: true,
        allowWaitlist: true,
        refundPolicy: true,
        metaTitle: true,
        metaDescription: true,
        organizerId: true,
        createdAt: true,
        updatedAt: true,
        averageRating: true,
        totalReviews: true,
        exhibitionSpaces: {
          select: {
            id: true,
            name: true,
            description: true,
            basePrice: true,
            pricePerSqm: true,
            minArea: true,
            isFixed: true,
            unit: true,
          },
        },
        organizer: {
          select: {
            id: true,
            firstName: true,
            avatar: true,
            company: true,
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
            venueZipCode: true,
            maxCapacity: true,
            totalHalls: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Add computed fields for public view
    const eventsWithComputedFields = events.map((event) => ({
      ...event,
      spotsRemaining: event.maxAttendees ? event.maxAttendees - event._count.registrations : null,
      isRegistrationOpen:
        new Date() >= new Date(event.registrationStart) && new Date() <= new Date(event.registrationEnd),
    }))

    return NextResponse.json({ events: eventsWithComputedFields }, { status: 200 })
  } catch (error) {
    console.error("Error in events API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}