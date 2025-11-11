import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
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
      },
    })
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    
    return NextResponse.json({ event })
  } catch (err) {
    console.error("Error fetching event:", err)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    console.log("Updating event:", id, data)

    // Map frontend fields to Prisma schema
    const updateData: any = {}
    
    // Basic fields that exist in your Prisma schema
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.date !== undefined) updateData.startDate = new Date(data.date)
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)
    if (data.maxCapacity !== undefined) updateData.maxAttendees = data.maxCapacity
    if (data.featured !== undefined) updateData.isFeatured = data.featured
    if (data.vip !== undefined) updateData.isVIP = data.vip
    if (data.category !== undefined) updateData.category = [data.category]
    if (data.tags !== undefined) updateData.tags = data.tags
    
    // Handle status mapping
    if (data.status !== undefined) {
      updateData.status = data.status === "Approved" ? "PUBLISHED" 
        : data.status === "Pending Review" ? "DRAFT"
        : data.status === "Flagged" ? "CANCELLED" 
        : data.status === "Rejected" ? "CANCELLED" 
        : data.status === "Draft" ? "DRAFT"
        : "DRAFT"
    }

    // Handle venue update - IMPROVED APPROACH
    if (data.venue || data.location) {
      console.log("Processing venue update:", { venue: data.venue, location: data.location })
      
      // Try to find existing venue by name (case insensitive)
      const existingVenue = await prisma.user.findFirst({
        where: {
          role: "VENUE_MANAGER",
          OR: [
            { venueName: { equals: data.venue, mode: 'insensitive' } },
            { venueName: { contains: data.venue, mode: 'insensitive' } }
          ]
        }
      })

      if (existingVenue) {
        console.log("Found existing venue:", existingVenue.venueName)
        // Connect to existing venue
        updateData.venue = {
          connect: { id: existingVenue.id }
        }
        
        // Also update venue city if provided
        if (data.location && data.location !== existingVenue.venueCity) {
          await prisma.user.update({
            where: { id: existingVenue.id },
            data: { venueCity: data.location }
          })
        }
      } else {
        console.log("No existing venue found, creating new venue...")
        // Create a new venue user
        const newVenue = await prisma.user.create({
          data: {
            venueName: data.venue || "Unknown Venue",
            venueCity: data.location || "Unknown Location",
            firstName: "Venue",
            lastName: "Manager",
            email: `venue-${Date.now()}@example.com`,
            password: "TEMP_PASSWORD",
            role: "VENUE_MANAGER"
          }
        })
        console.log("Created new venue:", newVenue.venueName)
        
        // Connect to the new venue
        updateData.venue = {
          connect: { id: newVenue.id }
        }
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
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
      },
    })

    console.log("Updated event venue info:", {
      venueName: updatedEvent.venue?.venueName,
      venueCity: updatedEvent.venue?.venueCity
    })

    // Format the response to match frontend expectations
    const formattedEvent = {
      id: updatedEvent.id,
      title: updatedEvent.title,
      organizer:
        updatedEvent.organizer?.organizationName ||
        `${updatedEvent.organizer?.firstName ?? ""} ${updatedEvent.organizer?.lastName ?? ""}`.trim() ||
        "Unknown Organizer",
      date: updatedEvent.startDate.toISOString().split('T')[0],
      endDate: updatedEvent.endDate.toISOString().split('T')[0],
      location: updatedEvent.venue?.venueCity || data.location || "Virtual", // Use the provided location if venue not found
      venue: updatedEvent.venue?.venueName || data.venue || "N/A", // Use the provided venue name if venue not found
      status:
        updatedEvent.status === "PUBLISHED"
          ? "Approved"
          : updatedEvent.status === "DRAFT"
          ? "Pending Review"
          : updatedEvent.status === "CANCELLED"
          ? "Flagged"
          : "Completed",
      attendees: updatedEvent.currentAttendees || 0,
      maxCapacity: updatedEvent.maxAttendees || 0,
      revenue: updatedEvent.analytics?.[0]?.totalRevenue || 0,
      ticketPrice: updatedEvent.ticketTypes?.[0]?.price || 0,
      category: updatedEvent.category?.[0] || "Other",
      featured: updatedEvent.isFeatured || false,
      vip: updatedEvent.isVIP || false,
      priority: "Medium",
      description: updatedEvent.description,
      tags: updatedEvent.tags,
      createdAt: updatedEvent.createdAt.toISOString(),
      lastModified: updatedEvent.updatedAt.toISOString(),
      views: updatedEvent.analytics?.[0]?.pageViews || 0,
      registrations: updatedEvent.analytics?.[0]?.totalRegistrations || 0,
      rating: updatedEvent.averageRating,
      reviews: updatedEvent.totalReviews,
      image: updatedEvent.bannerImage || "/placeholder.svg",
      promotionBudget:
        updatedEvent.promotions.reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
      socialShares: Math.floor(Math.random() * 1000),
      organizerId: updatedEvent.organizerId,
    }

    return NextResponse.json({ 
      success: true, 
      event: formattedEvent
    })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ 
      error: "Failed to update event",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log("Soft deleting event:", id)
    
    // Check if event exists first
    const event = await prisma.event.findUnique({
      where: { id }
    })
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }
    
    // Soft delete by updating status instead of actually deleting
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        status: "CANCELLED",
        isPublic: false,
      }
    })
    
    console.log("Event soft deleted successfully:", id)
    
    return NextResponse.json({ 
      success: true,
      message: "Event deleted successfully",
      event: updatedEvent
    })
  } catch (error) {
    console.error("Error soft deleting event:", error)
    return NextResponse.json({ 
      error: "Failed to delete event",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}