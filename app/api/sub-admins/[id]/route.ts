import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET sub-admin by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const auth = await authMiddleware(request)
    if (!auth.isValid || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subAdmin = await prisma.subAdmin.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!subAdmin) {
      return NextResponse.json({ error: "Sub-admin not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...subAdminWithoutPassword } = subAdmin

    return NextResponse.json({ subAdmin: subAdminWithoutPassword })
  } catch (error) {
    console.error("[v0] Get sub-admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE sub-admin
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const auth = await authMiddleware(request)
    if (!auth.isValid || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, email, permissions, phone, isActive } = await request.json()

    const subAdmin = await prisma.subAdmin.findUnique({
      where: { id },
    })

    if (!subAdmin) {
      return NextResponse.json({ error: "Sub-admin not found" }, { status: 404 })
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== subAdmin.email) {
      const existingSubAdmin = await prisma.subAdmin.findUnique({
        where: { email },
      })

      const existingSuperAdmin = await prisma.superAdmin.findUnique({
        where: { email },
      })

      if (existingSubAdmin || existingSuperAdmin) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
    }

    // Get IP address safely
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "unknown"

    const updatedSubAdmin = await prisma.subAdmin.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(permissions && { permissions }),
        ...(phone !== undefined && { phone }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create admin log
    await prisma.adminLog.create({
      data: {
        adminId: auth.user.id,
        adminType: "SUPER_ADMIN",
        action: "UPDATE_SUB_ADMIN",
        resource: "SUB_ADMIN",
        resourceId: updatedSubAdmin.id,
        details: {
          subAdminEmail: updatedSubAdmin.email,
          subAdminName: updatedSubAdmin.name,
          updatedFields: { name, email, permissions, phone, isActive },
        },
        ipAddress,
        userAgent: request.headers.get("user-agent") || "",
        superAdminId: auth.user.id,
      },
    })

    // Remove password from response
    const { password, ...subAdminWithoutPassword } = updatedSubAdmin

    return NextResponse.json({
      message: "Sub-admin updated successfully",
      subAdmin: subAdminWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Update sub-admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE sub-admin (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const auth = await authMiddleware(request)
    if (!auth.isValid || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const subAdmin = await prisma.subAdmin.findUnique({
      where: { id },
    })

    if (!subAdmin) {
      return NextResponse.json({ error: "Sub-admin not found" }, { status: 404 })
    }

    // Get IP address safely
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "unknown"

    // Soft delete by setting isActive to false
    await prisma.subAdmin.update({
      where: { id },
      data: { isActive: false },
    })

    // Create admin log
    await prisma.adminLog.create({
      data: {
        adminId: auth.user.id,
        adminType: "SUPER_ADMIN",
        action: "DELETE_SUB_ADMIN",
        resource: "SUB_ADMIN",
        resourceId: subAdmin.id,
        details: {
          subAdminEmail: subAdmin.email,
          subAdminName: subAdmin.name,
        },
        ipAddress,
        userAgent: request.headers.get("user-agent") || "",
        superAdminId: auth.user.id,
      },
    })

    return NextResponse.json({ message: "Sub-admin deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete sub-admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
