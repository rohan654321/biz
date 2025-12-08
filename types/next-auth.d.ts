// types/next-auth.d.ts
import "next-auth"
import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  /**
   * Extends the built-in session.user and user types
   */
  interface User extends DefaultUser {
    id: string
    role: string
    adminType?: "SUPER_ADMIN" | "SUB_ADMIN"
    permissions?: string[]
    firstName?: string
    lastName?: string
    avatar?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      adminType?: "SUPER_ADMIN" | "SUB_ADMIN"
      permissions?: string[]
      firstName?: string
      lastName?: string
      avatar?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    adminType?: "SUPER_ADMIN" | "SUB_ADMIN"
    permissions?: string[]
    firstName?: string
    lastName?: string
    avatar?: string | null
  }
}