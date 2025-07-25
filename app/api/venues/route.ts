import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/venues - Get all venues with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const city = searchParams.get("city")
    const isPremium = searchParams.get("isPremium")
    const minCapacity = searchParams.get("minCapacity")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {}
    if (city) where.location = { path: ["city"], equals: city }
    if (isPremium !== null) where.isPremium = isPremium === "true"
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { amenities: { has: search } },
      ]
    }

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          location: true,
          contact: true,
          capacity: true,
          amenities: true,
          pricing: true,
          averageRating: true,
          totalRatings: true,
          isVerified: true,
          isPremium: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.venue.count({ where }),
    ])

    return NextResponse.json({
      venues,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching venues:", error)
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 })
  }
}

// POST /api/venues - Create a new venue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const venue = await prisma.venue.create({
      data: body,
    })

    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error("Error creating venue:", error)
    return NextResponse.json({ error: "Failed to create venue" }, { status: 500 })
  }
}
