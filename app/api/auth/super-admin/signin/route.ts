// app/api/auth/super-admin/signin/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find super admin
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email },
    })

    if (!superAdmin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if account is active
    if (!superAdmin.isActive) {
      return NextResponse.json({ error: "Account is deactivated. Please contact support." }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password)

    if (!isPasswordValid) {
      // Increment login attempts
      await prisma.superAdmin.update({
        where: { id: superAdmin.id },
        data: {
          loginAttempts: superAdmin.loginAttempts + 1,
        },
      })

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Reset login attempts on successful login
    await prisma.superAdmin.update({
      where: { id: superAdmin.id },
      data: {
        loginAttempts: 0,
        lastLogin: new Date(),
      },
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        id: superAdmin.id,
        email: superAdmin.email,
        role: superAdmin.role,
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    )

    // Remove password from response
    const { password: _, ...superAdminWithoutPassword } = superAdmin

    return NextResponse.json({
      message: "Sign in successful",
      token,
      superAdmin: superAdminWithoutPassword,
    })
  } catch (error) {
    console.error("Super admin signin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}