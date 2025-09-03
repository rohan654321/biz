import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Validate ID
    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, error: "Invalid speaker ID" }, { status: 400 })
    }

    // Query database
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
        speakingExperience: speaker.speakingExperience || "", // Make sure this field exists in your schema
      },
    })
  } catch (error) {
    console.error("Error in speaker API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    
    console.log("Received data:", body) // Debug log

    // Split fullName → firstName + lastName
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
        speakingExperience: body.speakingExperience || "", // Make sure this field exists in your schema
      },
    })

    // Return the exact structure that frontend expects
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
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}