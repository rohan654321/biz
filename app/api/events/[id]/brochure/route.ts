import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir, readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// ✅ Allowed file types
const VALID_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/gif"]
// ✅ Max file size (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024
// ✅ Upload directory
const UPLOAD_DIR = join(process.cwd(), "public/uploads")

// ========================
// PUT — Upload / Replace Brochure
// ========================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const brochureFile = formData.get("brochure") as File | null

    if (!brochureFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!VALID_FILE_TYPES.includes(brochureFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or image file." },
        { status: 400 }
      )
    }

    if (brochureFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Please upload a file smaller than 10MB." },
        { status: 400 }
      )
    }

    // ✅ Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // ✅ Create unique file name
    const ext = brochureFile.name.split(".").pop() || "pdf"
    const fileName = `brochure-${Date.now()}.${ext}`
    const filePath = join(UPLOAD_DIR, fileName)

    // ✅ Convert to buffer & write
    const bytes = await brochureFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // ✅ Update DB
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { brochure: `/uploads/${fileName}` },
    })

    return NextResponse.json(updatedEvent, { status: 200 })
  } catch (error) {
    console.error("❌ Error updating brochure:", error)
    return NextResponse.json(
      { error: "Failed to update brochure" },
      { status: 500 }
    )
  }
}

// ========================
// GET — View or Download Brochure
// ========================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") // "view" | "download"

    const event = await prisma.event.findUnique({
      where: { id },
      select: { brochure: true },
    })

    if (!event?.brochure) {
      return NextResponse.json({ error: "Brochure not found" }, { status: 404 })
    }

    const brochurePath = event.brochure

    // ✅ Handle Local File
    if (brochurePath.startsWith("/uploads/")) {
      const filePath = join(process.cwd(), "public", brochurePath)
      const fileBuffer = await readFile(filePath)

      // ✅ Convert to Uint8Array (fixes TS error)
      const uint8Array = new Uint8Array(fileBuffer)

      // ✅ Determine MIME type
      const contentType = brochurePath.endsWith(".pdf")
        ? "application/pdf"
        : brochurePath.endsWith(".jpg") || brochurePath.endsWith(".jpeg")
        ? "image/jpeg"
        : brochurePath.endsWith(".png")
        ? "image/png"
        : brochurePath.endsWith(".gif")
        ? "image/gif"
        : "application/octet-stream"

      return new NextResponse(uint8Array, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition":
            action === "download"
              ? `attachment; filename="brochure.${brochurePath.split(".").pop()}"`
              : "inline",
          "Cache-Control": "public, max-age=31536000",
        },
      })
    }

    // ✅ Handle External URL (e.g., Cloudinary)
    const response = await fetch(brochurePath)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch external brochure (${response.status})` },
        { status: response.status }
      )
    }

    const fileArrayBuffer = await response.arrayBuffer()
    const contentType =
      response.headers.get("content-type") ||
      (brochurePath.endsWith(".pdf") ? "application/pdf" : "application/octet-stream")

    // ✅ Convert to Uint8Array to ensure compatibility
    const uint8Array = new Uint8Array(fileArrayBuffer)

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition":
          action === "download"
            ? `attachment; filename="brochure.${brochurePath.split(".").pop() || "pdf"}"`
            : "inline",
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("❌ Error fetching brochure:", error)
    return NextResponse.json({ error: "Failed to fetch brochure" }, { status: 500 })
  }
}

// ========================
// DELETE — Remove Brochure
// ========================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
      select: { brochure: true },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // ✅ Remove brochure field from DB
    await prisma.event.update({
      where: { id },
      data: { brochure: null },
    })

    return NextResponse.json(
      { message: "Brochure removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error deleting brochure:", error)
    return NextResponse.json(
      { error: "Failed to delete brochure" },
      { status: 500 }
    )
  }
}
