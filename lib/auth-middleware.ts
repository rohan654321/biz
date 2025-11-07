import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "./prisma"

interface AuthUser {
  id: string
  email: string
  role: "SUPER_ADMIN" | "SUB_ADMIN"
  type: "SUPER_ADMIN" | "SUB_ADMIN"
}

interface AuthResult {
  isValid: boolean
  user: AuthUser | null
}

export async function authMiddleware(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from cookies or Authorization header
    let token = request.cookies.get("superAdminToken")?.value

    if (!token) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return { isValid: false, user: null }
    }

    // Verify token using your existing JWT secret
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "your-secret-key") as any

    // Check if it's a super admin
    if (decoded.role === "SUPER_ADMIN") {
      const superAdmin = await prisma.superAdmin.findUnique({
        where: {
          id: decoded.id,
          isActive: true,
        },
      })

      if (!superAdmin) {
        return { isValid: false, user: null }
      }

      return {
        isValid: true,
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          role: "SUPER_ADMIN",
          type: "SUPER_ADMIN",
        },
      }
    }

    // Check if it's a sub admin
    if (decoded.role === "SUB_ADMIN") {
      const subAdmin = await prisma.subAdmin.findUnique({
        where: {
          id: decoded.id,
          isActive: true,
        },
        include: { createdBy: true },
      })

      if (!subAdmin) {
        return { isValid: false, user: null }
      }

      return {
        isValid: true,
        user: {
          id: subAdmin.id,
          email: subAdmin.email,
          role: "SUB_ADMIN",
          type: "SUB_ADMIN",
        },
      }
    }

    return { isValid: false, user: null }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return { isValid: false, user: null }
  }
}
