import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { EventStatus, SessionType, SessionStatus, UserRole } from "@prisma/client"
import { ObjectId } from "mongodb"

// Helper function to parse category input
function parseCategory(category: any): string[] {
  if (Array.isArray(category)) {
    return category.filter(Boolean)
  }
  if (typeof category === 'string') {
    return category.split(',').map((cat: string) => cat.trim()).filter(Boolean)
  }
  return []
}

// Helper function to parse space costs
function parseSpaceCosts(spaceCosts: any[], currency: string = "USD") {
  return spaceCosts.map(space => ({
    spaceType: space.spaceType || space.type || "CUSTOM",
    name: space.type || space.name || "Custom Space",
    description: space.description || "",
    basePrice: space.pricePerSqm || space.pricePerUnit || space.basePrice || 0,
    pricePerSqm: space.pricePerSqm || 0,
    minArea: space.minArea || space.area || 0,
    isFixed: space.isFixed || false,
    additionalPowerRate: space.additionalPowerRate || 0,
    compressedAirRate: space.compressedAirRate || 0,
    unit: space.unit || null,
    area: space.area || space.minArea || 0,
    dimensions: space.dimensions || (space.minArea ? `${space.minArea} sq.m` : ""),
    location: space.location || null,
    isAvailable: true,
    maxBooths: space.maxBooths || null,
    bookedBooths: 0,
    setupRequirements: space.setupRequirements || null,
    currency: currency,
    powerIncluded: space.powerIncluded || false,
  }))
}

// Helper function to parse speaker sessions - FIXED VERSION
function parseSpeakerSessions(speakerSessions: any[]) {
  return speakerSessions.map(session => ({
    title: session.title || "Presentation",
    description: session.description || "",
    sessionType: (session.sessionType?.toUpperCase() as SessionType) || SessionType.PRESENTATION,
    duration: session.duration || 60,
    startTime: new Date(session.startTime || session.startDate || new Date()),
    endTime: new Date(session.endTime || session.endDate || new Date(Date.now() + 60 * 60 * 1000)),
    room: session.room || null,
    abstract: session.abstract || null,
    learningObjectives: session.learningObjectives || [],
    targetAudience: session.targetAudience || null,
    // REMOVED: materials: session.materials || [], - This was causing the error
    status: SessionStatus.SCHEDULED,
    speakerId: session.speakerId
  }))
}

// Helper function to create or find user by email and role
async function findOrCreateUser(userData: {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  role: UserRole
  phone?: string
  avatar?: string
  venueName?: string
  venueCity?: string
  venueAddress?: string
  jobTitle?: string
  bio?: string
}) {
  const { email, role, ...data } = userData
  
  // Try to find existing user by email and role
  let user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      role: role
    }
  })
  
  if (user) {
    console.log(`Found existing ${role}:`, user.email)
    
    // Update user details if provided
    const updateData: any = {}
    if (data.firstName && data.firstName !== user.firstName) updateData.firstName = data.firstName
    if (data.lastName && data.lastName !== user.lastName) updateData.lastName = data.lastName
    if (data.company && data.company !== user.company) updateData.company = data.company
    if (data.phone && data.phone !== user.phone) updateData.phone = data.phone
    if (data.avatar && data.avatar !== user.avatar) updateData.avatar = data.avatar
    if (data.venueName && data.venueName !== user.venueName) updateData.venueName = data.venueName
    if (data.venueCity && data.venueCity !== user.venueCity) updateData.venueCity = data.venueCity
    if (data.venueAddress && data.venueAddress !== user.venueAddress) updateData.venueAddress = data.venueAddress
    if (data.jobTitle && data.jobTitle !== user.jobTitle) updateData.jobTitle = data.jobTitle
    if (data.bio && data.bio !== user.bio) updateData.bio = data.bio
    
    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })
      console.log(`Updated ${role} details:`, user.email)
    }
    
    return user
  }
  
  // Create new user
  console.log(`Creating new ${role}:`, email)
  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstName: data.firstName || role === "VENUE_MANAGER" ? "Venue" : "User",
      lastName: data.lastName || role === "VENUE_MANAGER" ? "Manager" : "Name",
      company: data.company || "",
      phone: data.phone || "",
      avatar: data.avatar || `/placeholder.svg?height=100&width=100&text=${role.charAt(0)}`,
      venueName: data.venueName,
      venueCity: data.venueCity,
      venueAddress: data.venueAddress,
      jobTitle: data.jobTitle,
      bio: data.bio,
      role: role,
      password: "TEMP_PASSWORD_123!",
      isActive: true
    }
  })
  
  return newUser
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { not: "CANCELLED" }
      },
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            organizationName: true,
          },
        },
        venue: {
          select: {
            venueName: true,
            venueCity: true,
          },
        },
        promotions: {
          select: { amount: true },
        },
        reviews: true,
        analytics: {
          select: {
            totalRevenue: true,
            totalRegistrations: true,
            pageViews: true,
          },
        },
        ticketTypes: {
          select: {
            price: true,
          },
        },
        speakerSessions: {
          include: {
            speaker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true
              }
            }
          }
        }
      },
    })

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      organizer:
        event.organizer?.organizationName ||
        `${event.organizer?.firstName ?? ""} ${event.organizer?.lastName ?? ""}`.trim() ||
        "Unknown Organizer",
      date: event.startDate.toISOString().split('T')[0],
      endDate: event.endDate.toISOString().split('T')[0],
      location: event.venue?.venueCity || "Virtual",
      venue: event.venue?.venueName || "N/A",
      status:
        event.status === "PUBLISHED"
          ? "Approved"
          : event.status === "DRAFT"
          ? "Pending Review"
          : event.status === "CANCELLED"
          ? "Flagged"
          : "Completed",
      attendees: event.currentAttendees || 0,
      maxCapacity: event.maxAttendees || 0,
      revenue: event.analytics?.[0]?.totalRevenue || 0,
      ticketPrice: event.ticketTypes?.[0]?.price || 0,
      category: event.category?.[0] || "Other",
      featured: event.isFeatured || false,
      vip: event.isVIP || false,
      priority: "Medium",
      description: event.description,
      tags: event.tags,
      createdAt: event.createdAt.toISOString(),
      lastModified: event.updatedAt.toISOString(),
      views: event.analytics?.[0]?.pageViews || 0,
      registrations: event.analytics?.[0]?.totalRegistrations || 0,
      rating: event.averageRating,
      reviews: event.totalReviews,
      image: event.bannerImage || "/placeholder.svg",
      promotionBudget:
        event.promotions.reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
      socialShares: Math.floor(Math.random() * 1000),
      speakers: event.speakerSessions?.map(session => ({
        id: session.speaker.id,
        name: `${session.speaker.firstName} ${session.speaker.lastName}`,
        company: session.speaker.company
      })) || []
    }))

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    )
  }
}

// ✅ Corrected POST Handler - Only includes fields that exist in your schema
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    console.log("Creating event with data:", JSON.stringify(body, null, 2))

    // Validate required fields
    const requiredFields = ['title', 'description', 'startDate', 'endDate']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const images = Array.isArray(body.images) ? body.images : []
    const videos = Array.isArray(body.videos) ? body.videos : []
    const documents = Array.isArray(body.documents)
      ? body.documents.filter(Boolean)
      : [body.brochure, body.layoutPlan].filter(Boolean)

    // 🔹 ORGANIZER SELECTION/CREATION LOGIC
    let organizerId = session.user.id // Default to admin
    
    if (body.organizerId && ObjectId.isValid(body.organizerId)) {
      // Use provided organizer ID
      const organizer = await prisma.user.findFirst({
        where: {
          id: body.organizerId,
          role: "ORGANIZER"
        }
      })
      
      if (organizer) {
        organizerId = body.organizerId
        console.log("Using provided organizer:", organizerId)
      }
    }
    
    // If no organizer ID provided or found, try to find/create by email or name
    if (!organizerId || organizerId === session.user.id) {
      const organizerEmail = body.organizerEmail || body.organizer?.email
      const organizerName = body.organizerName || body.organizer?.name
      
      if (organizerEmail) {
        const organizer = await findOrCreateUser({
          email: organizerEmail,
          firstName: organizerName?.split(' ')[0] || "Event",
          lastName: organizerName?.split(' ').slice(1).join(' ') || "Organizer",
          company: body.organizer?.company || body.organizationName,
          role: "ORGANIZER",
          phone: body.organizer?.phone,
          bio: body.organizer?.description
        })
        organizerId = organizer.id
        console.log("Using organizer by email:", organizerId, organizer.email)
      } else if (organizerName) {
        // Create organizer with generated email
        const generatedEmail = `organizer-${Date.now()}@eventify.com`
        const organizer = await findOrCreateUser({
          email: generatedEmail,
          firstName: organizerName.split(' ')[0],
          lastName: organizerName.split(' ').slice(1).join(' '),
          company: body.organizer?.company,
          role: "ORGANIZER"
        })
        organizerId = organizer.id
        console.log("Created new organizer:", organizerId, organizer.email)
      }
    }

    // 🔹 VENUE SELECTION/CREATION LOGIC
    let venueId = null
    
    if (body.venueId && ObjectId.isValid(body.venueId)) {
      // Use provided venue ID
      const venue = await prisma.user.findFirst({
        where: {
          id: body.venueId,
          role: "VENUE_MANAGER"
        }
      })
      
      if (venue) {
        venueId = body.venueId
        console.log("Using provided venue:", venueId, venue.venueName)
      }
    }
    
    // If no venue ID provided, try to find/create by name or details
    if (!venueId && (body.venueName || body.venue || body.city || body.address)) {
      const venueName = body.venueName || body.venue || "Event Venue"
      const venueCity = body.city || body.location || "Unknown Location"
      const venueAddress = body.address || ""
      const venueEmail = body.venueEmail || `venue-${Date.now()}@eventify.com`
      
      const venue = await findOrCreateUser({
        email: venueEmail,
        firstName: "Venue",
        lastName: "Manager",
        role: "VENUE_MANAGER",
        venueName: venueName,
        venueCity: venueCity,
        venueAddress: venueAddress,
        phone: body.venuePhone
      })
      
      venueId = venue.id
      console.log("Using venue:", venueId, venue.venueName)
    }

    // 🔹 SPEAKER SESSIONS LOGIC
    const speakerSessionsData = body.speakerSessions || []
    const hasSpeakers = speakerSessionsData.length > 0
    const processedSessions = []

    if (hasSpeakers) {
      console.log("Processing speaker sessions:", speakerSessionsData.length)
      
      for (const sessionData of speakerSessionsData) {
        let speakerId = sessionData.speakerId
        
        // If no speaker ID provided, try to find/create speaker
        if (!speakerId && (sessionData.speakerEmail || sessionData.speakerName)) {
          const speakerEmail = sessionData.speakerEmail || `speaker-${Date.now()}@eventify.com`
          const speakerName = sessionData.speakerName || "Event Speaker"
          
          const speaker = await findOrCreateUser({
            email: speakerEmail,
            firstName: speakerName.split(' ')[0],
            lastName: speakerName.split(' ').slice(1).join(' '),
            company: sessionData.speakerCompany,
            jobTitle: sessionData.speakerTitle || "Speaker",
            bio: sessionData.speakerBio,
            role: "SPEAKER",
            phone: sessionData.speakerPhone,
            avatar: sessionData.speakerImage
          })
          
          speakerId = speaker.id
          console.log("Using speaker:", speakerId, speaker.email)
        }
        
        if (speakerId) {
          processedSessions.push({
            ...sessionData,
            speakerId: speakerId
          })
        }
      }
    }

    // 🔹 EXHIBITOR BOOTHS LOGIC
    const exhibitorBoothsData = body.exhibitorBooths || []
    const hasExhibitors = exhibitorBoothsData.length > 0
    const processedExhibitors = []

    if (hasExhibitors) {
      console.log("Processing exhibitor booths:", exhibitorBoothsData.length)
      
      for (const exhibitorData of exhibitorBoothsData) {
        let exhibitorId = exhibitorData.exhibitorId
        
        // If no exhibitor ID provided, try to find/create exhibitor
        if (!exhibitorId && (exhibitorData.exhibitorEmail || exhibitorData.exhibitorName)) {
          const exhibitorEmail = exhibitorData.exhibitorEmail || `exhibitor-${Date.now()}@eventify.com`
          const exhibitorName = exhibitorData.exhibitorName || "Event Exhibitor"
          
          const exhibitor = await findOrCreateUser({
            email: exhibitorEmail,
            firstName: exhibitorName.split(' ')[0],
            lastName: exhibitorName.split(' ').slice(1).join(' '),
            company: exhibitorData.company,
            jobTitle: exhibitorData.jobTitle || "Exhibitor",
            bio: exhibitorData.description,
            role: "EXHIBITOR",
            phone: exhibitorData.phone
          })
          
          exhibitorId = exhibitor.id
          console.log("Using exhibitor:", exhibitorId, exhibitor.email)
        }
        
        if (exhibitorId) {
          processedExhibitors.push({
            ...exhibitorData,
            exhibitorId: exhibitorId,
            companyName: exhibitorData.company || "Unknown Company",
            totalCost: exhibitorData.totalCost || 0
          })
        }
      }
    }

    // Create the event
    const eventId = new ObjectId().toHexString()
    
    // Build the event data object - ONLY INCLUDING FIELDS THAT EXIST IN YOUR SCHEMA
    const eventData: any = {
      id: eventId,
      title: body.title,
      description: body.description,
      shortDescription: body.shortDescription || body.description?.substring(0, 200) || null,
      slug: body.slug || body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      status: (body.status?.toUpperCase() as EventStatus) || EventStatus.DRAFT,
      category: parseCategory(body.categories || body.category || body.eventCategories),
      tags: body.tags || [],
      eventType: body.eventType ? [body.eventType] : [],
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      registrationStart: new Date(body.registrationStart || body.startDate),
      registrationEnd: new Date(body.registrationEnd || body.endDate),
      timezone: body.timezone || "UTC",
      isVirtual: body.isVirtual || false,
      virtualLink: body.virtualLink || null,
      venueId: venueId,
      maxAttendees: body.maxAttendees || body.maxCapacity || null,
      currentAttendees: 0,
      currency: body.currency || "USD",
      images: images,
      videos: videos,
      documents: documents,
      brochure: body.brochure || null,
      layoutPlan: body.layoutPlan || null,
      bannerImage: body.bannerImage || images[0] || null,
      thumbnailImage: body.thumbnailImage || images[0] || null,
      isPublic: body.isPublic !== false,
      requiresApproval: body.requiresApproval || false,
      allowWaitlist: body.allowWaitlist || false,
      refundPolicy: body.refundPolicy || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      isFeatured: body.featured || body.isFeatured || false,
      isVIP: body.vip || body.isVIP || false,
      organizerId: organizerId,
    }

    // Add edition if provided
    if (body.edition) {
      eventData.edition = body.edition.toString()
    }

    // Create ticket types
    const ticketTypesData = [
      {
        name: "General Admission",
        description: "General admission ticket",
        price: body.generalPrice || body.ticketPrice || 0,
        quantity: body.maxAttendees || body.maxCapacity || 100,
        isActive: true,
      },
      ...(body.studentPrice > 0 ? [{
        name: "Student",
        description: "Student ticket",
        price: body.studentPrice,
        quantity: Math.floor((body.maxAttendees || body.maxCapacity || 100) * 0.2),
        isActive: true,
      }] : []),
      ...(body.vipPrice > 0 ? [{
        name: "VIP",
        description: "VIP ticket with premium access",
        price: body.vipPrice,
        quantity: Math.floor((body.maxAttendees || body.maxCapacity || 100) * 0.1),
        isActive: true,
      }] : []),
      ...(body.groupPrice > 0 ? [{
        name: "Group",
        description: "Group ticket",
        price: body.groupPrice,
        quantity: Math.floor((body.maxAttendees || body.maxCapacity || 100) * 0.15),
        isActive: true,
      }] : [])
    ].filter(Boolean)

    if (ticketTypesData.length > 0) {
      eventData.ticketTypes = {
        create: ticketTypesData
      }
    }

    // Create exhibition spaces
    if (body.spaceCosts && body.spaceCosts.length > 0) {
      eventData.exhibitionSpaces = {
        create: parseSpaceCosts(body.spaceCosts, body.currency || "USD")
      }
    }

    // Create speaker sessions - FIXED: No materials field
    if (processedSessions.length > 0) {
      eventData.speakerSessions = {
        create: parseSpeakerSessions(processedSessions)
      }
    }

    // Create exhibitor booths
    if (processedExhibitors.length > 0) {
      eventData.exhibitorBooths = {
        create: processedExhibitors.map(exhibitor => ({
          boothNumber: exhibitor.boothNumber || `B-${Math.floor(Math.random() * 1000)}`,
          boothSize: exhibitor.boothSize || "3x3",
          status: exhibitor.status || "CONFIRMED",
          specialRequirements: exhibitor.specialRequirements || [],
          notes: exhibitor.notes || null,
          companyName: exhibitor.companyName || exhibitor.company || "Unknown Company",
          totalCost: exhibitor.totalCost || 0,
          exhibitorId: exhibitor.exhibitorId,
          spaceId: exhibitor.spaceId || undefined,
          spaceReference: exhibitor.spaceReference || null
        }))
      }
    }

    console.log("Creating event with data:", JSON.stringify(eventData, null, 2))

    const newEvent = await prisma.event.create({
      data: eventData,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationName: true,
            company: true,
            phone: true
          }
        },
        venue: {
          select: {
            id: true,
            venueName: true,
            venueCity: true,
            venueAddress: true,
            venueState: true,
            venueCountry: true,
          }
        },
        exhibitionSpaces: true,
        ticketTypes: true,
        speakerSessions: {
          include: {
            speaker: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                company: true,
                jobTitle: true,
                avatar: true
              }
            }
          }
        },
        exhibitorBooths: {
          include: {
            exhibitor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                company: true,
                phone: true
              }
            }
          }
        }
      }
    })

    // Format the response
    const formattedEvent = {
      id: newEvent.id,
      title: newEvent.title,
      organizer: newEvent.organizer ? 
        newEvent.organizer.organizationName ||
        `${newEvent.organizer.firstName || ""} ${newEvent.organizer.lastName || ""}`.trim() ||
        "Unknown Organizer" : "Unknown Organizer",
      date: newEvent.startDate.toISOString().split('T')[0],
      endDate: newEvent.endDate.toISOString().split('T')[0],
      location: newEvent.venue?.venueCity || "Virtual",
      venue: newEvent.venue?.venueName || "N/A",
      status: newEvent.status === "PUBLISHED"
        ? "Approved"
        : newEvent.status === "DRAFT"
        ? "Pending Review"
        : newEvent.status === "CANCELLED"
        ? "Flagged"
        : "Completed",
      attendees: newEvent.currentAttendees || 0,
      maxCapacity: newEvent.maxAttendees || 0,
      revenue: 0,
      ticketPrice: newEvent.ticketTypes?.[0]?.price || 0,
      category: newEvent.category?.[0] || "Other",
      featured: newEvent.isFeatured || false,
      vip: newEvent.isVIP || false,
      priority: "Medium",
      description: newEvent.description,
      tags: newEvent.tags,
      createdAt: newEvent.createdAt.toISOString(),
      lastModified: newEvent.updatedAt.toISOString(),
      views: 0,
      registrations: 0,
      rating: newEvent.averageRating,
      reviews: newEvent.totalReviews,
      image: newEvent.bannerImage || "/placeholder.svg",
      promotionBudget: 0,
      socialShares: 0,
      organizerId: newEvent.organizerId,
      venueId: newEvent.venueId,
      organizerDetails: newEvent.organizer,
      venueDetails: newEvent.venue,
      speakers: newEvent.speakerSessions?.map(session => ({
        id: session.speaker.id,
        name: `${session.speaker.firstName} ${session.speaker.lastName}`,
        email: session.speaker.email,
        company: session.speaker.company,
        jobTitle: session.speaker.jobTitle,
        avatar: session.speaker.avatar,
        sessionTitle: session.title,
        sessionId: session.id
      })) || [],
      exhibitors: newEvent.exhibitorBooths?.map(booth => ({
        id: booth.exhibitor.id,
        name: `${booth.exhibitor.firstName} ${booth.exhibitor.lastName}`,
        email: booth.exhibitor.email,
        company: booth.exhibitor.company,
        phone: booth.exhibitor.phone,
        boothNumber: booth.boothNumber,
        boothId: booth.id
      })) || [],
      exhibitionSpaces: newEvent.exhibitionSpaces,
      ticketTypes: newEvent.ticketTypes
    }

    // Log the admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        adminType: session.user.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "SUB_ADMIN",
        action: "EVENT_CREATED",
        resource: "EVENT",
        resourceId: newEvent.id,
        details: {
          title: newEvent.title,
          organizerId: newEvent.organizerId,
          venueId: newEvent.venueId,
          speakerCount: newEvent.speakerSessions?.length || 0,
          exhibitorCount: newEvent.exhibitorBooths?.length || 0,
          spaceCount: newEvent.exhibitionSpaces?.length || 0,
          status: newEvent.status
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully with all entities",
        event: formattedEvent,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}