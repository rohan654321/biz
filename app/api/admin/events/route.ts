import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
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
      },
    })

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      organizer:
        event.organizer?.organizationName ||
        `${event.organizer?.firstName ?? ""} ${event.organizer?.lastName ?? ""}`.trim() ||
        "Unknown Organizer",
      date: event.startDate.toDateString(),
      endDate: event.endDate.toDateString(),
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
      createdAt: event.createdAt,
      lastModified: event.updatedAt,
      views: event.analytics?.[0]?.pageViews || 0,
      registrations: event.analytics?.[0]?.totalRegistrations || 0,
      rating: event.averageRating,
      reviews: event.totalReviews,
      image: event.bannerImage || "/placeholder.svg",
      promotionBudget:
        event.promotions.reduce((acc, p) => acc + (p.amount || 0), 0) || 0,
      socialShares: Math.floor(Math.random() * 1000),
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
