import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch all organizers
    const organizers = await prisma.user.findMany({
      where: { role: "ORGANIZER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        website: true,
        location: true,
        organizationName: true,
        description: true,
        headquarters: true,
        founded: true,
        teamSize: true,
        specialties: true,
        isVerified: true,
        _count: {
          select: {
            organizedEvents: { where: { status: "PUBLISHED" } },
          },
        },
      },
    })

    const organizersWithStats = await Promise.all(
      organizers.map(async (organizer) => {
        // Fetch event IDs for this organizer
        const events = await prisma.event.findMany({
          where: { organizerId: organizer.id },
          select: { id: true },
        })
        const eventIds = events.map((e) => e.id)

        // Count confirmed registrations
        const attendeeCount = await prisma.eventRegistration.count({
          where: { eventId: { in: eventIds }, status: "CONFIRMED" },
        })

        // Calculate years of experience safely
        const foundedYear = Number.parseInt(organizer.founded || "2020")
        const yearsOfExperience = isNaN(foundedYear) ? 0 : new Date().getFullYear() - foundedYear

        return {
          id: organizer.id,
          name: organizer.organizationName || `${organizer.firstName} ${organizer.lastName}`,
          image: organizer.avatar || "/images/signupimg.png",
          rating: 4.5, // placeholder
          reviewCount: 0,
          location: organizer.location || "Not specified",
          country: "India",
          category: "Corporate Events",
          eventsOrganized: events.length,
          yearsOfExperience,
          specialties: organizer.specialties || ["Event Management"],
          description: organizer.description || organizer.bio || "",
          phone: organizer.phone || "",
          email: organizer.email,
          website: organizer.website || "",
          verified: organizer.isVerified || false,
          featured: false,
          totalAttendees: `${Math.floor(attendeeCount / 1000)}K+`,
          successRate: 95,
          nextAvailable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }
      }),
    )

    return NextResponse.json({ organizers: organizersWithStats })
  } catch (error) {
    console.error("Error fetching organizers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
