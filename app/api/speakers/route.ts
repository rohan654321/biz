import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const expertise = searchParams.get("expertise") || ""

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {
      role: "SPEAKER",
      isActive: true,
    }

    // Search across multiple fields
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          jobTitle: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          specialties: {
            hasSome: [search],
          },
        },
      ]
    }

    // Filter by expertise (specialties)
    if (expertise) {
      where.specialties = {
        has: expertise
      }
    }

    await prisma.$connect()

    // Get speakers with enhanced data
    const speakers = await prisma.user.findMany({
      where,
      skip,
      take: limit,
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
        activeEvents: true,
        totalAttendees: true,
        totalRevenue: true,
        averageRating: true,
        totalReviews: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        totalEvents: "desc",
      },
    })

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    // Get unique specialties for filters
    const allSpeakersWithSpecialties = await prisma.user.findMany({
      where: { role: "SPEAKER", isActive: true },
      select: { specialties: true }
    })

    const allExpertise = Array.from(
      new Set(
        allSpeakersWithSpecialties.flatMap(speaker => speaker.specialties)
      )
    ).filter(Boolean).sort()

    console.log(`Found ${speakers.length} speakers out of ${total} total`)

    return NextResponse.json({
      success: true,
      speakers,
      filters: {
        expertise: allExpertise,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

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
      speakingExperience,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      )
    }

    const speaker = await prisma.user.create({
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
        speakingExperience,
        role: "SPEAKER",
        password: "temp_password", // In production, use proper password hashing
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      speaker,
      message: "Speaker created successfully",
    })
  } catch (error) {
    console.error("Error creating speaker:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}