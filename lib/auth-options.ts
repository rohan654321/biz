import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
// import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      firstName?: string
      lastName?: string
      avatar?: string | null   // 👈 Add this
    }
  }

  interface User {
    id: string
    role?: string
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    firstName?: string
    lastName?: string
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
          return null
        }

        try {
          // Check for hardcoded admin users first (for testing)
          if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
            return {
              id: "admin-1",
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
              firstName: "Admin",
              lastName: "User",
            }
          }

          if (credentials.email === "organizer@example.com" && credentials.password === "organizer123") {
            return {
              id: "organizer-1",
              name: "Organizer User",
              email: "organizer@example.com",
              role: "organizer",
              firstName: "Organizer",
              lastName: "User",
            }
          }

          if (credentials.email === "mainadmin@example.com" && credentials.password === "superadmin123") {
            return {
              id: "superadmin-1",
              name: "Super Admin User",
              email: "mainadmin@example.com",
              role: "superadmin",
              firstName: "Super Admin",
              lastName: "User",
            }
          }

          // Check database for real users
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await (credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
}
