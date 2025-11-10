import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      adminType?: "SUPER_ADMIN" | "SUB_ADMIN"
      permissions?: string[]
    }
  }
  interface User {
    id: string
    role: string
    adminType: "SUPER_ADMIN" | "SUB_ADMIN"
    permissions: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    adminType: "SUPER_ADMIN" | "SUB_ADMIN"
    permissions: string[]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing email or password")
          return null
        }

        try {
          console.log("[v0] Attempting login for:", credentials.email)

          // Check SuperAdmin table first
          const superAdmin = await prisma.superAdmin.findUnique({
            where: { email: credentials.email },
          })

          console.log("[v0] SuperAdmin found:", !!superAdmin)

          if (superAdmin) {
            // Check if account is locked
            if (superAdmin.lockoutUntil && superAdmin.lockoutUntil > new Date()) {
              console.log("[v0] Account is locked until:", superAdmin.lockoutUntil)
              throw new Error("Account is locked. Please try again later.")
            }

            console.log(
              "[v0] Comparing passwords - Input length:",
              credentials.password.length,
              "Stored length:",
              superAdmin.password.length,
            )
            const isPasswordValid = await bcrypt.compare(credentials.password, superAdmin.password)

            console.log("[v0] SuperAdmin password valid:", isPasswordValid)

            if (!isPasswordValid) {
              await prisma.superAdmin.update({
                where: { id: superAdmin.id },
                data: {
                  loginAttempts: superAdmin.loginAttempts + 1,
                  lockoutUntil: superAdmin.loginAttempts + 1 >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null,
                },
              })
              console.log("[v0] Invalid password, login attempts:", superAdmin.loginAttempts + 1)
              return null
            }

            // Reset login attempts on successful login
            await prisma.superAdmin.update({
              where: { id: superAdmin.id },
              data: {
                loginAttempts: 0,
                lockoutUntil: null,
                lastLogin: new Date(),
              },
            })

            console.log("[v0] SuperAdmin login successful")
            return {
              id: superAdmin.id,
              name: superAdmin.name,
              email: superAdmin.email,
              role: superAdmin.role,
              adminType: "SUPER_ADMIN" as const,
              permissions: superAdmin.permissions || [],
            }
          }

          // Check SubAdmin table
          const subAdmin = await prisma.subAdmin.findUnique({
            where: { email: credentials.email },
          })

          console.log("[v0] SubAdmin found:", !!subAdmin)

          if (!subAdmin) {
            console.log("[v0] No admin found with this email")
            return null
          }

          // Check if account is locked
          if (subAdmin.lockoutUntil && subAdmin.lockoutUntil > new Date()) {
            console.log("[v0] SubAdmin account is locked until:", subAdmin.lockoutUntil)
            throw new Error("Account is locked. Please try again later.")
          }

          console.log(
            "[v0] Comparing passwords - Input length:",
            credentials.password.length,
            "Stored length:",
            subAdmin.password.length,
          )
          const isPasswordValid = await bcrypt.compare(credentials.password, subAdmin.password)

          console.log("[v0] SubAdmin password valid:", isPasswordValid)

          if (!isPasswordValid) {
            await prisma.subAdmin.update({
              where: { id: subAdmin.id },
              data: {
                loginAttempts: subAdmin.loginAttempts + 1,
                lockoutUntil: subAdmin.loginAttempts + 1 >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null,
              },
            })
            console.log("[v0] Invalid password, login attempts:", subAdmin.loginAttempts + 1)
            return null
          }

          // Reset login attempts
          await prisma.subAdmin.update({
            where: { id: subAdmin.id },
            data: {
              loginAttempts: 0,
              lockoutUntil: null,
              lastLogin: new Date(),
            },
          })

          console.log("[v0] SubAdmin login successful")
          return {
            id: subAdmin.id,
            name: subAdmin.name,
            email: subAdmin.email,
            role: subAdmin.role,
            adminType: "SUB_ADMIN" as const,
            permissions: subAdmin.permissions || [],
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.adminType = user.adminType
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.adminType = token.adminType as "SUPER_ADMIN" | "SUB_ADMIN"
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
}
