"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createEventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(10),
  highlights: z.array(z.string()),
  location: z.object({
    city: z.string(),
    venue: z.string(),
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  timings: z.object({
    startDate: z.string(),
    endDate: z.string(),
    dailyStart: z.string(),
    dailyEnd: z.string(),
    timezone: z.string(),
  }),
  pricing: z.object({
    general: z.number(),
    student: z.number().optional(),
    vip: z.number().optional(),
    currency: z.string(),
  }),
  stats: z.object({
    expectedVisitors: z.string(),
    exhibitors: z.string(),
    duration: z.string(),
  }),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  ageLimit: z.string(),
  dressCode: z.string(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]),
  organizerId: z.string(),
})

type CreateEventResult =
  | { success: true; event: { id: string; slug: string; title: string } }
  | { success: false; error: string }

export async function createEvent(data: z.infer<typeof createEventSchema>): Promise<CreateEventResult> {
  try {
    console.log("Server action called with data:", data)

    // Validate the data
    const validatedData = createEventSchema.parse(data)
    console.log("Data validated successfully:", validatedData)

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingEvent) {
      console.log("Slug already exists:", validatedData.slug)
      return {
        success: false,
        error: "An event with this slug already exists",
      }
    }

    // For now, let's create a default organizer if none exists
    let organizer = await prisma.organizer.findFirst({
      where: { id: validatedData.organizerId },
    })

    if (!organizer) {
      console.log("Creating default organizer...")
      organizer = await prisma.organizer.create({
        data: {
          name: "EventCorp India",
          description: "Professional Event Management",
          phone: "+91 98765 43210",
          email: "info@eventcorp.in",
          avatar: "/placeholder.svg?height=48&width=48",
        },
      })
      console.log("Default organizer created:", organizer)
    }

    // Create the event
    console.log("Creating event...")
    const event = await prisma.event.create({
      data: {
        ...validatedData,
        organizerId: organizer.id, // Use the actual organizer ID
        timings: {
          ...validatedData.timings,
          startDate: new Date(validatedData.timings.startDate),
          endDate: new Date(validatedData.timings.endDate),
        },
        rating: {
          average: 0,
          count: 0,
        },
        images: [],
        exhibitSpaceCosts: [],
        featuredItems: [],
        featuredExhibitors: [],
        touristAttractions: [],
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    })

    console.log("Event created successfully:", event)

    revalidatePath("/admin/events")
    revalidatePath("/events")

    return {
      success: true,
      event,
    }
  } catch (error) {
    console.error("Error creating event:", error)

    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors)
      return {
        success: false,
        error: "Invalid form data: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "Failed to create event. Please try again.",
    }
  }
}

export async function getOrganizers() {
  try {
    const organizers = await prisma.organizer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    return organizers
  } catch (error) {
    console.error("Error fetching organizers:", error)
    return []
  }
}
