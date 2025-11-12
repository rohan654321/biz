import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeCounts = searchParams.get('includeCounts') === 'true'

    // Get all categories
    const categories = await prisma.eventCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    let categoriesWithData = categories

    if (includeCounts) {
      // Get event counts for each category
      const categoriesWithEventCounts = await Promise.all(
        categories.map(async (category) => {
          const eventCount = await prisma.eventsOnCategories.count({
            where: {
              categoryId: category.id
            }
          })
          
          return {
            ...category,
            eventCount
          }
        })
      )

      categoriesWithData = categoriesWithEventCounts
    }

    return NextResponse.json(categoriesWithData)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, icon, color, isActive = true } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Check if category already exists
    const existingCategory = await prisma.eventCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      )
    }

    const category = await prisma.eventCategory.create({
      data: {
        name,
        description,
        icon,
        color,
        isActive
      }
    })

    return NextResponse.json({
      ...category,
      eventCount: 0 // New category starts with 0 events
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}