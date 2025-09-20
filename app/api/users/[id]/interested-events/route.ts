// app/api/users/[userId]/interested-events/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId  // ✅ direct and safe

    console.log("Session user ID:", session.user.id)
    console.log("Requested user ID:", userId)
    console.log("User role:", session.user.role)

    if (session.user.id !== userId && session.user.role !== "ADMIN") {
      console.log("Access denied - user doesn't match and not admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Fetching events for user:", userId)

    // Fetch user's event leads (interested events)
    const eventLeads = await prisma.eventLead.findMany({
      where: {
        userId: userId,
        status: { 
          not: "REJECTED" // Only show active interests
        },
      },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { followUpDate: "asc" }, // Show follow-ups first
      ],
    })

    console.log("Found event leads:", eventLeads.length)
    console.log("Event lead user IDs:", eventLeads.map(lead => lead.userId))

    // Transform the data to match your frontend expectations
    const interestedEvents = eventLeads.map((lead) => ({
      id: lead.event.id,
      title: lead.event.title,
      description: lead.event.description,
      shortDescription: lead.event.shortDescription,
      startDate: lead.event.startDate.toISOString(),
      endDate: lead.event.endDate.toISOString(),
      location: lead.event.location || lead.event.venue?.venueName || "TBA",
      city: lead.event.city || lead.event.venue?.venueCity,
      state: lead.event.state || lead.event.venue?.venueState,
      status: lead.event.status,
      type: lead.event.eventType?.[0] || "General",
      bannerImage: lead.event.bannerImage,
      thumbnailImage: lead.event.thumbnailImage,
      organizer: lead.event.organizer,
      
      // Lead-specific information
      leadId: lead.id,
      leadStatus: lead.status,
      leadType: lead.type,
      contactedAt: lead.contactedAt?.toISOString(),
      followUpDate: lead.followUpDate?.toISOString(),
      leadNotes: lead.notes,
      
      // Additional event info
      currentRegistrations: lead.event._count.registrations,
      maxAttendees: lead.event.maxAttendees,
    }))

    return NextResponse.json({ 
      events: interestedEvents,
      total: interestedEvents.length 
    })
    
  } catch (error) {
    console.error("Error fetching interested events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}