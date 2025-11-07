import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authMiddleware } from "@/lib/auth-middleware"
import bcrypt from "bcryptjs"

// GET all sub-admins (Super Admin only)
export async function GET(request: NextRequest) {
  try {
    const auth = await authMiddleware(request)

    console.log("[v0] Auth result for GET /sub-admins:", {
      isValid: auth.isValid,
      user: auth.user,
    })

    if (!auth.isValid || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const subAdmins = await prisma.subAdmin.findMany({
      where: { isActive: true },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ subAdmins })
  } catch (error) {
    console.error("[v0] Get sub-admins error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CREATE new sub-admin (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await authMiddleware(request)

    console.log("[v0] Auth result for POST /sub-admins:", {
      isValid: auth.isValid,
      user: auth.user,
    })

    if (!auth.isValid || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, email, password, permissions, phone, role } = await request.json()

    if (!name || !email || !password || !permissions || !role) {
      return NextResponse.json({ 
        error: "Name, email, password, role, and permissions are required" 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ["SUB_ADMIN", "MODERATOR", "SUPPORT"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: "Invalid role. Must be one of: SUB_ADMIN, MODERATOR, SUPPORT" 
      }, { status: 400 })
    }

    // Check if email already exists
    const existingSubAdmin = await prisma.subAdmin.findUnique({
      where: { email: email.toLowerCase() },
    })

    const existingSuperAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingSubAdmin || existingSuperAdmin) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12)

    // Get IP address safely
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "unknown"

    // Create sub-admin
    const subAdmin = await prisma.subAdmin.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        permissions,
        phone: phone || null,
        role,
        createdById: auth.user.id,
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
        action: "CREATE_SUB_ADMIN",
        resource: "SUB_ADMIN",
        resourceId: subAdmin.id,
        details: {
          subAdminEmail: subAdmin.email,
          subAdminName: subAdmin.name,
          subAdminRole: subAdmin.role,
          permissions: subAdmin.permissions,
        },
        ipAddress,
        userAgent: request.headers.get("user-agent") || "",
        superAdminId: auth.user.id,
      },
    })

    // Remove password from response
    const { password: _, ...subAdminWithoutPassword } = subAdmin

    return NextResponse.json(
      {
        message: "Sub-admin created successfully",
        subAdmin: subAdminWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create sub-admin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}