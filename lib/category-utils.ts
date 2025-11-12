import { prisma } from "@/lib/prisma"

export async function assignCategoriesToEvent(eventId: string, categoryIds: string[]) {
  // First, remove existing category associations
  await prisma.eventsOnCategories.deleteMany({
    where: { eventId }
  })

  // Then create new associations
  if (categoryIds.length > 0) {
    await prisma.eventsOnCategories.createMany({
      data: categoryIds.map(categoryId => ({
        eventId,
        categoryId
      }))
    })
  }
}

export async function getEventCategories(eventId: string) {
  const eventWithCategories = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  return eventWithCategories?.categories.map(ec => ec.category) || []
}

export async function getCategoriesWithEventCount() {
  const categories = await prisma.eventCategory.findMany({
    include: {
      _count: {
        select: {
          events: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return categories.map(category => ({
    ...category,
    eventCount: category._count.events
  }))
}