import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

// GET handler – fetch speaker by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    console.log(`GET speaker with id: ${id}`)

    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "Invalid speaker ID" }, { status: 400 })
    }

    if (id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid speaker ID format" }, { status: 400 })
    }

    await prisma.$connect()
    console.log("Database connected")

    const speaker = await prisma.user.findFirst({
      where: {
        id,
        role: "SPEAKER",
      },
    })

    if (!speaker) {
      return NextResponse.json({ success: false, error: "Speaker not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        fullName: `${speaker.firstName} ${speaker.lastName}`.trim(),
        designation: speaker.jobTitle || "",
        company: speaker.company || "",
        email: speaker.email || "",
        phone: speaker.phone || "",
        linkedin: speaker.linkedin || "",
        website: speaker.website || "",
        location: speaker.location || "",
        bio: speaker.bio || "",
        speakingExperience: speaker.speakingExperience || "",
      },
    })
  } catch (error) {
    console.error("Error in speaker API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// PUT handler – update speaker by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    if (id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid speaker ID format" }, { status: 400 })
    }

    console.log("Received data:", body)

    const [firstName, ...lastNameParts] = body.fullName?.split(" ") || []
    const lastName = lastNameParts.join(" ")

    const updatedProfile = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName || "",
        lastName: lastName || "",
        jobTitle: body.designation || "",
        company: body.company || "",
        email: body.email || "",
        phone: body.phone || "",
        linkedin: body.linkedin || "",
        website: body.website || "",
        location: body.location || "",
        bio: body.bio || "",
        speakingExperience: body.speakingExperience || "",
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        fullName: `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim(),
        designation: updatedProfile.jobTitle || "",
        company: updatedProfile.company || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        linkedin: updatedProfile.linkedin || "",
        website: updatedProfile.website || "",
        location: updatedProfile.location || "",
        bio: updatedProfile.bio || "",
        speakingExperience: updatedProfile.speakingExperience || "",
      },
    })
  } catch (error) {
    console.error("PUT /api/speakers/[id] error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST handler – create a new speaker
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

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

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
        password: "temp_password", // Handle properly in production!
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
