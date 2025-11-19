import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const venueManagers = await prisma.user.findMany({
      where: { role: "VENUE_MANAGER" },
      include: { 
        meetingSpaces: true,
        venueReviews: true,
      },
    })

    const venues = venueManagers.map((manager) => ({
      id: manager.id,
      venueName: manager.venueName || manager.company || "",
      logo: manager.avatar || "",
      contactPerson: `${manager.firstName} ${manager.lastName}`.trim(),
      email: manager.email,
      mobile: manager.phone || "",
      address: manager.venueAddress || manager.location || "",
      city: manager.venueCity || "",
      state: manager.venueState || "",
      country: manager.venueCountry || "",
      website: manager.website || "",
      description: manager.venueDescription || manager.bio || "",
      maxCapacity: manager.maxCapacity || 0,
      totalHalls: manager.totalHalls || 0,
      totalEvents: manager.totalEvents || 0,
      activeBookings: manager.activeBookings || 0,
      averageRating: manager.averageRating || 0,
      totalReviews: manager.totalReviews || 0,
      amenities: manager.amenities || [],
      meetingSpaces: manager.meetingSpaces || [],
      isVerified: manager.isVerified || false,
      venueImages: manager.venueImages || [],
      status: manager.isActive ? "active" : "suspended",
      createdAt: manager.createdAt.toISOString(),
      updatedAt: manager.updatedAt.toISOString(),
    }))

    return NextResponse.json({ success: true, venues })
  } catch (error) {
    console.error("Error fetching venue managers:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      venueName,
      contactPerson,
      email,
      mobile,
      address,
      city,
      state,
      country,
      website,
      description,
      maxCapacity,
      totalHalls,
      amenities,
      isVerified,
      status,
    //   mapUrl,
    //   managerName,
    //   managerPhone,
      venueImages = [],
      logo,
    //   minCapacity,
    //   emergencyExits,
    //   safetyInfo,
    //   safetyCertifications = [],
    } = body

    // Validate required fields
    if (!venueName || !email || !contactPerson || !address) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Venue name, email, contact person, and address are required" 
        },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.role !== "VENUE_MANAGER") {
      return NextResponse.json(
        { success: false, error: "Email already exists with a different role" },
        { status: 400 }
      )
    }

    // Split contact manager name
    let firstName = ""
    let lastName = ""
    if (contactPerson) {
      const parts = contactPerson.split(" ")
      firstName = parts[0] || ""
      lastName = parts.slice(1).join(" ") || ""
    }

    // Generate a temporary password
    const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`

    const venueManager = await prisma.user.upsert({
      where: { email },
      update: {
        role: "VENUE_MANAGER",
        firstName,
        lastName,
        phone: mobile,
        venueName,
        company: venueName,
        venueAddress: address,
        venueCity: city,
        venueState: state,
        venueCountry: country,
        website,
        venueDescription: description,
        bio: description,
        maxCapacity: parseInt(maxCapacity) || 0,
        // minCapacity: parseInt(minCapacity) || 0,
        totalHalls: parseInt(totalHalls) || 0,
        amenities: amenities || [],
        // mapUrl: mapUrl || "",
        // managerName: managerName || "",
        // managerPhone: managerPhone || "",
        // emergencyExits: parseInt(emergencyExits) || 0,
        // safetyInfo: safetyInfo || "",
        // safetyCertifications: safetyCertifications || [],
        isVerified: isVerified || false,
        isActive: status === "active",
        organizerIdForVenueManager: session.user.id,
        avatar: logo || null,
        venueImages: venueImages || [],
      },
      create: {
        role: "VENUE_MANAGER",
        email,
        password: tempPassword,
        firstName,
        lastName,
        phone: mobile,
        venueName,
        company: venueName,
        venueAddress: address,
        venueCity: city,
        venueState: state,
        venueCountry: country,
        website,
        venueDescription: description,
        bio: description,
        maxCapacity: parseInt(maxCapacity) || 0,
        // minCapacity: parseInt(minCapacity) || 0,
        totalHalls: parseInt(totalHalls) || 0,
        amenities: amenities || [],
        // mapUrl: mapUrl || "",
        // managerName: managerName || "",
        // managerPhone: managerPhone || "",
        // emergencyExits: parseInt(emergencyExits) || 0,
        // safetyInfo: safetyInfo || "",
        // safetyCertifications: safetyCertifications || [],
        isVerified: isVerified || false,
        isActive: status === "active",
        organizerIdForVenueManager: session.user.id,
        avatar: logo || null,
        venueImages: venueImages || [],
      }
    })

    return NextResponse.json({
      success: true,
      venue: {
        id: venueManager.id,
        venueName: venueManager.venueName,
        contactPerson: `${venueManager.firstName} ${venueManager.lastName}`.trim(),
        email: venueManager.email,
        mobile: venueManager.phone,
        address: venueManager.venueAddress,
        city: venueManager.venueCity,
        state: venueManager.venueState,
        country: venueManager.venueCountry,
        website: venueManager.website,
        description: venueManager.venueDescription,
        maxCapacity: venueManager.maxCapacity,
        // minCapacity: venueManager.minCapacity,
        totalHalls: venueManager.totalHalls,
        amenities: venueManager.amenities,
        isVerified: venueManager.isVerified,
        // mapUrl: venueManager.mapUrl,
        // managerName: venueManager.managerName,
        // managerPhone: venueManager.managerPhone,
        // emergencyExits: venueManager.emergencyExits,
        // safetyInfo: venueManager.safetyInfo,
        // safetyCertifications: venueManager.safetyCertifications,
        logo: venueManager.avatar,
        venueImages: venueManager.venueImages,
        status: venueManager.isActive ? "active" : "suspended",
      }
    })
  } catch (error) {
    console.error("Error creating venue:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}