import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/exhibitors - Get all exhibitors with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const isPremium = searchParams.get("isPremium")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {}
    if (category) where.category = category
    if (isPremium !== null) where.isPremium = isPremium === "true"
    if (search) {
      where.OR = [
        { company: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { products: { has: search } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [exhibitors, total] = await Promise.all([
      prisma.exhibitor.findMany({
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
              email: true,
              phone: true,
              isVerified: true,
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
      prisma.exhibitor.count({ where }),
    ])

    return NextResponse.json({
      exhibitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching exhibitors:", error)
    return NextResponse.json({ error: "Failed to fetch exhibitors" }, { status: 500 })
  }
}

// POST /api/exhibitors - Create a new exhibitor profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, company, logo, category, products, website, booth, specialOffers } = body

    // Check if exhibitor profile already exists for this user
    const existingExhibitor = await prisma.exhibitor.findUnique({
      where: { userId },
    })

    if (existingExhibitor) {
      return NextResponse.json({ error: "Exhibitor profile already exists for this user" }, { status: 400 })
    }

    const exhibitor = await prisma.exhibitor.create({
      data: {
        userId,
        company,
        logo,
        category,
        products,
        website,
        booth,
        specialOffers,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json(exhibitor, { status: 201 })
  } catch (error) {
    console.error("Error creating exhibitor:", error)
    return NextResponse.json({ error: "Failed to create exhibitor" }, { status: 500 })
  }
}
