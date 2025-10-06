import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// DELETE - Remove brochure
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: (await params).id },
      select: { documents: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Filter out brochure documents
    const updatedDocuments = event.documents.filter((doc) => !doc.includes("brochure"))

    await prisma.event.update({
     where: { id: (await params).id },
      data: { documents: updatedDocuments },
    })

    return NextResponse.json({ message: "Brochure removed successfully" })
  } catch (error) {
    console.error("Error deleting brochure:", error)
    return NextResponse.json({ error: "Failed to delete brochure" }, { status: 500 })
  }
}
