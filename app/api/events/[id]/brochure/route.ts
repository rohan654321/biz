import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import fs from "fs";
import path from "path";

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const event = await prisma.event.findUnique({ 
    where: { id },
    select: { brochure: true }
  });

  if (!event?.brochure) {
    return NextResponse.json({ error: "Brochure not found" }, { status: 404 });
  }

  // Redirect to Cloudinary URL
  return NextResponse.redirect(event.brochure);
}

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
