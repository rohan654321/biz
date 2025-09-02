import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch organizer data with aggregated statistics
    const organizer = await prisma.user.findFirst({
      where: {
        id: id,
        role: "ORGANIZER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        website: true,
        linkedin: true,
        twitter: true,
        company: true,
        location: true,
        organizationName: true,
        description: true,
        headquarters: true,
        founded: true,
        teamSize: true,
        specialties: true,
        achievements: true,
        certifications: true,
        businessEmail: true,
        businessPhone: true,
        businessAddress: true,
        totalEvents: true,
        activeEvents: true,
        totalAttendees: true,
        totalRevenue: true,
        createdAt: true,
        _count: {
          select: {
            organizedEvents: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 })
    }

    // Get actual event statistics
    const eventStats = await prisma.event.aggregate({
      where: {
        organizerId: id,
      },
      _count: {
        id: true,
      },
    })

    const activeEventStats = await prisma.event.aggregate({
      where: {
        organizerId: id,
        status: "PUBLISHED",
      },
      _count: {
        id: true,
      },
    })

    // Get total attendees from registrations
    const attendeeStats = await prisma.eventRegistration.aggregate({
      where: {
        event: {
          organizerId: id,
        },
        status: "CONFIRMED",
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
    })

    const organizerData = {
      id: organizer.id,
      name: `${organizer.firstName} ${organizer.lastName}`,
      company: organizer.organizationName || organizer.company || `${organizer.firstName} ${organizer.lastName}`,
      email: organizer.email,
      phone: organizer.phone || "",
      location: organizer.location || "",
      website: organizer.website || "",
      description: organizer.description || organizer.bio || "",
      avatar: organizer.avatar || "/placeholder.svg?height=100&width=100&text=Avatar",
      totalEvents: eventStats._count.id,
      activeEvents: activeEventStats._count.id,
      totalAttendees: attendeeStats._count.id,
      totalRevenue: attendeeStats._sum.totalAmount || 0,
      founded: organizer.founded || "2020",
      teamSize: organizer.teamSize || "1-10",
      headquarters: organizer.headquarters || organizer.location || "Not specified",
      specialties: organizer.specialties || ["Event Management"],
      achievements: organizer.achievements || [],
      certifications: organizer.certifications || [],
      organizationName:
        organizer.organizationName || organizer.company || `${organizer.firstName} ${organizer.lastName}`,
      businessEmail: organizer.businessEmail || organizer.email,
      businessPhone: organizer.businessPhone || organizer.phone,
      businessAddress: organizer.businessAddress || organizer.location,
    }

    return NextResponse.json({ organizer: organizerData })
  } catch (error) {
    console.error("Error fetching organizer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fix: Allow both the user themselves and admins to update
    if (session.user?.id !== id && session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - You can only update your own profile" }, { status: 403 })
    }

    const body = await request.json()

    // Update organizer in database
    const updatedOrganizer = await prisma.user.update({
      where: {
        id: id,
        role: "ORGANIZER",
      },
      data: {
        firstName: body.name?.split(" ")[0] || body.firstName,
        lastName: body.name?.split(" ").slice(1).join(" ") || body.lastName,
        email: body.email,
        phone: body.phone,
        bio: body.description,
        website: body.website,
        linkedin: body.linkedin,
        twitter: body.twitter,
        company: body.company || body.organizationName,
        location: body.location || body.headquarters,
        organizationName: body.company || body.organizationName,
        description: body.description,
        headquarters: body.headquarters,
        founded: body.founded,
        teamSize: body.teamSize,
        specialties: body.specialties,
        achievements: body.achievements,
        certifications: body.certifications,
        businessEmail: body.businessEmail || body.email,
        businessPhone: body.businessPhone || body.phone,
        businessAddress: body.businessAddress || body.headquarters,
        avatar: body.avatar,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organizationName: true,
        description: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "Organizer updated successfully",
      organizer: updatedOrganizer,
    })
  } catch (error) {
    console.error("Error updating organizer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
