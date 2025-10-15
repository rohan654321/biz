import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema (if you want to use it later)
const createVenueSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  venueName: z.string().min(1, "Venue name is required"),
  venueDescription: z.string().optional(),
  venueAddress: z.string().optional(),
  venueCity: z.string().optional(),
  venueState: z.string().optional(),
  venueCountry: z.string().optional(),
  venueZipCode: z.string().optional(),
  maxCapacity: z.number().optional(),
  totalHalls: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  role: z.literal("VENUE_MANAGER"),
})

/**
 * GET /api/venues
 */
export async function GET(request: NextRequest) {
  try {
    // Validate session (optional: you can remove this if public route)
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query params for pagination & search
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get all VENUE_MANAGERs (no organizer filter)
    const where: any = { role: "VENUE_MANAGER" }

    if (search) {
      where.OR = [
        { venueName: { contains: search, mode: "insensitive" } },
        { venueDescription: { contains: search, mode: "insensitive" } },
        { venueAddress: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch from Prisma
    const [venues, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          organizerIdForVenueManager: true,
          venueName: true,
          venueDescription: true,
          venueAddress: true,
          maxCapacity: true,
          totalHalls: true,
          averageRating: true,
          totalReviews: true,
          amenities: true,
          venueCurrency: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    // Response
    return NextResponse.json({
      success: true,
      data: venues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching venues:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch venues" },
      { status: 500 }
    )
  }
}
/**
 * POST /api/venues
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      company,
      jobTitle,
      location,
      website,
      linkedin,
      twitter,
      specialties,
      achievements,
      certifications,
      venueName,
      venueDescription,
      venueAddress,
      venueCity,
      venueState,
      venueCountry,
      venueZipCode,
      venuePhone,
      venueEmail,
      venueWebsite,
      maxCapacity,
      totalHalls,
      amenities,
    } = body

    if (!firstName || !lastName || !email || !venueName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      )
    }

    const venueManager = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        bio,
        company,
        jobTitle,
        location,
        website,
        linkedin,
        twitter,
        specialties: specialties || [],
        achievements: achievements || [],
        certifications: certifications || [],
        role: "VENUE_MANAGER",
        password: "temp_password", // ⚠️ hash in production
        isActive: true,
        organizerIdForVenueManager: session.user.id,
        venueName,
        venueDescription,
        venueAddress,
        venueCity,
        venueState,
        venueCountry,
        venueZipCode,
        venuePhone,
        venueEmail,
        venueWebsite,
        maxCapacity,
        totalHalls,
        amenities: amenities || [],
      },
    })

    return NextResponse.json({
      success: true,
      venueManager,
      message: "Venue Manager created successfully",
    })
  } catch (error) {
    console.error("Error creating venue manager:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
