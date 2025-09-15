import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {
      role: "SPEAKER",
      isActive: true,
    }

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
          specialties: {
            has: search,
          },
        },
      ]
    }

    await prisma.$connect()
    console.log("Database connected for speakers list")

    const [speakers, total] = await Promise.all([
      prisma.user.findMany({
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
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ])

    console.log(`Found ${speakers.length} speakers out of ${total} total`)

    return NextResponse.json({
      success: true,
      speakers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
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
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
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
        password: "temp_password", // This should be handled properly in production
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
