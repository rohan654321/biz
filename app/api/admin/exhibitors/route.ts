import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const industry = searchParams.get("industry") || "all"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      role: "EXHIBITOR",
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status !== "all") {
      where.isActive = status === "active"
    }

    if (industry !== "all") {
      where.companyIndustry = industry
    }

    // Fetch exhibitors with pagination
    const [exhibitors, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
          businessEmail: true,
          businessPhone: true,
          businessAddress: true,
          taxId: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          companyIndustry: true,
          // Statistics
          _count: {
            select: {
              exhibitorBooths: true,
              products: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    // Format response with additional statistics
// In the GET function, update the formattedExhibitors section:
const formattedExhibitors = exhibitors.map(exhibitor => ({
  id: exhibitor.id,
  companyName: exhibitor.company || "Unnamed Company", // Handle null company
  contactPerson: `${exhibitor.firstName || ""} ${exhibitor.lastName || ""}`.trim() || "Unknown Contact",
  email: exhibitor.email || "No email",
  phone: exhibitor.phone || "No phone",
  website: exhibitor.website || "",
  industry: exhibitor.companyIndustry || "Other",
  location: exhibitor.location || "Unknown location",
  status: exhibitor.isActive ? "active" : exhibitor.isVerified ? "pending" : "suspended",
  verified: exhibitor.isVerified,
  joinDate: exhibitor.createdAt.toISOString(),
  eventsParticipated: exhibitor._count.exhibitorBooths,
  totalProducts: exhibitor._count.products,
  avatar: exhibitor.avatar || "/placeholder.svg",
  description: exhibitor.bio || "No description available",
  revenue: Math.floor(Math.random() * 300000) + 50000,
  rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
}))

    return NextResponse.json({
      exhibitors: formattedExhibitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching exhibitors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      password = "TEMP_PASSWORD", // Generate temp password
      bio,
      company,
      jobTitle,
      location,
      website,
      linkedin,
      twitter,
      businessEmail,
      businessPhone,
      businessAddress,
      taxId,
      companyIndustry,
      isVerified = false,
      isActive = true,
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return NextResponse.json(
        {
          error: "Missing required fields: firstName, lastName, email, company",
        },
        { status: 400 },
      )
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
        },
        { status: 409 },
      )
    }

    // Create new exhibitor
    const exhibitor = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password, // In production, hash this password
        bio,
        company,
        jobTitle,
        location,
        website,
        linkedin,
        twitter,
        businessEmail,
        businessPhone,
        businessAddress,
        taxId,
        companyIndustry,
        role: "EXHIBITOR",
        isActive,
        isVerified,
        emailVerified: false,
      },
    })

    // Remove password from response
    const { password: _, ...exhibitorWithoutPassword } = exhibitor

    return NextResponse.json(
      { 
        exhibitor: exhibitorWithoutPassword,
        message: "Exhibitor created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating exhibitor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}