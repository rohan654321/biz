import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/speakers - Get all speakers with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const expertise = searchParams.get("expertise")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {}
    if (expertise) where.expertise = { has: expertise }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [speakers, total] = await Promise.all([
      prisma.speaker.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              isVerified: true,
              socialLinks: true,
            },
          },
          _count: {
            select: {
              likes: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.speaker.count({ where }),
    ])

    return NextResponse.json({
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
    return NextResponse.json({ error: "Failed to fetch speakers" }, { status: 500 })
  }
}

// POST /api/speakers - Create a new speaker profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, company, expertise, achievements } = body

    // Check if speaker profile already exists for this user
    const existingSpeaker = await prisma.speaker.findUnique({
      where: { userId },
    })

    if (existingSpeaker) {
      return NextResponse.json({ error: "Speaker profile already exists for this user" }, { status: 400 })
    }

    const speaker = await prisma.speaker.create({
      data: {
        userId,
        title,
        company,
        expertise,
        achievements,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
      },
    })

    return NextResponse.json(speaker, { status: 201 })
  } catch (error) {
    console.error("Error creating speaker:", error)
    return NextResponse.json({ error: "Failed to create speaker" }, { status: 500 })
  }
}
