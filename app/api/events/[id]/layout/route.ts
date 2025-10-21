import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const prisma = new PrismaClient()

// PUT - Update layout plan
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const formData = await request.formData()
    const layoutFile = formData.get('layout') as File

    if (!layoutFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (!validTypes.includes(layoutFile.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await layoutFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = layoutFile.name.split('.').pop()
    const fileName = `layout-${Date.now()}.${fileExtension}`
    const uploadDir = join(process.cwd(), 'public/uploads')

    // Create uploads directory if it doesn't exist
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
        console.log('Created uploads directory:', uploadDir)
      }
    } catch (dirError) {
      console.error('Error creating uploads directory:', dirError)
      return NextResponse.json({ error: "Failed to create upload directory" }, { status: 500 })
    }

    const filePath = join(uploadDir, fileName)
    
    try {
      await writeFile(filePath, buffer)
      console.log('File saved successfully:', filePath)
    } catch (error) {
      console.error('Error saving file:', error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }

    // Update event with new layout plan path
    const updatedEvent = await prisma.event.update({
      where: { id: (await params).id },
      data: { 
        layoutPlan: `/uploads/${fileName}`,
        // Also update the documents array if you're storing it there
        documents: {
          push: `/uploads/${fileName}`
        }
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating layout plan:", error)
    return NextResponse.json({ error: "Failed to update layout plan" }, { status: 500 })
  }
}

// DELETE - Remove layout plan
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: (await params).id },
      select: { documents: true, layoutPlan: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Update event to remove layout plan
    const updatedEvent = await prisma.event.update({
      where: { id: (await params).id },
      data: { 
        layoutPlan: null,
        // Remove layout plan from documents array
        documents: event.documents.filter((doc) => doc !== event.layoutPlan)
      },
    })

    return NextResponse.json({ message: "Layout plan removed successfully" })
  } catch (error) {
    console.error("Error deleting layout plan:", error)
    return NextResponse.json({ error: "Failed to delete layout plan" }, { status: 500 })
  }
}