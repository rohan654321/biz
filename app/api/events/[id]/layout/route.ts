import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// DELETE - Remove layout plan
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Assuming layout plans are stored in event.documents array
    const event = await prisma.event.findUnique({
      where: { id:(await params).id },
      select: { documents: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Filter out layout plan documents (you may need to adjust this logic)
    const updatedDocuments = event.documents.filter((doc) => !doc.includes("layout"))

    await prisma.event.update({
      where: { id:(await params).id },
      data: { documents: updatedDocuments },
    })

    return NextResponse.json({ message: "Layout plan removed successfully" })
  } catch (error) {
    console.error("Error deleting layout plan:", error)
    return NextResponse.json({ error: "Failed to delete layout plan" }, { status: 500 })
  }
}
