// lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import type { NextAuthOptions } from "next-auth"
import bcrypt from "bcryptjs"

// Import Prisma
import { prisma } from "@/lib/prisma"

// Safe Prisma wrapper
const safePrisma = {
  superAdmin: {
    findUnique: async (args: any) => {
      try {
        if (!prisma?.superAdmin) {
          console.error("Prisma superAdmin model is not available")
          return null
        }
        return await prisma.superAdmin.findUnique(args)
      } catch (error) {
        console.error("Error in superAdmin.findUnique:", error)
        return null
      }
    },
    update: async (args: any) => {
      try {
        if (!prisma?.superAdmin) return null
        return await prisma.superAdmin.update(args)
      } catch (error) {
        console.error("Error in superAdmin.update:", error)
        return null
      }
    }
  },
  subAdmin: {
    findUnique: async (args: any) => {
      try {
        if (!prisma?.subAdmin) return null
        return await prisma.subAdmin.findUnique(args)
      } catch (error) {
        console.error("Error in subAdmin.findUnique:", error)
        return null
      }
    },
    update: async (args: any) => {
      try {
        if (!prisma?.subAdmin) return null
        return await prisma.subAdmin.update(args)
      } catch (error) {
        console.error("Error in subAdmin.update:", error)
        return null
      }
    }
  },
  user: {
    findUnique: async (args: any) => {
      try {
        if (!prisma?.user) return null
        return await prisma.user.findUnique(args)
      } catch (error) {
        console.error("Error in user.findUnique:", error)
        return null
      }
    },
    create: async (args: any) => {
      try {
        if (!prisma?.user) return null
        return await prisma.user.create(args)
      } catch (error) {
        console.error("Error in user.create:", error)
        return null
      }
    },
    update: async (args: any) => {
      try {
        if (!prisma?.user) return null
        return await prisma.user.update(args)
      } catch (error) {
        console.error("Error in user.update:", error)
        return null
      }
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
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

          // Check SuperAdmin table first using safe wrapper
          const superAdmin = await safePrisma.superAdmin.findUnique({
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
              await safePrisma.superAdmin.update({
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
            await safePrisma.superAdmin.update({
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
          const subAdmin = await safePrisma.subAdmin.findUnique({
            where: { email: credentials.email },
          })

          console.log("[v0] SubAdmin found:", !!subAdmin)

          if (subAdmin) {
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
              await safePrisma.subAdmin.update({
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
            await safePrisma.subAdmin.update({
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
          }

          // Check regular User table
          const user = await safePrisma.user.findUnique({
            where: { email: credentials.email },
          })

          console.log("[v0] Regular user found:", !!user)

          if (!user) {
            console.log("[v0] No user found with this email")
            return null
          }

          // For regular users, check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("[v0] Regular user invalid password")
            return null
          }

          console.log("[v0] Regular user login successful")
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          }

        } catch (error) {
          console.error("[v0] Auth error:", error)
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "linkedin") {
        try {
          const existingUser = await safePrisma.user.findUnique({
            where: { email: user.email! },
          });

          // If user doesn't exist → create new user in DB
          if (!existingUser) {
            await safePrisma.user.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(" ")[0] || "User",
                lastName: user.name?.split(" ")[1] || "",
                avatar: user.image,
                role: "ATTENDEE",
                isVerified: true,
                emailVerified: true,
                password: await bcrypt.hash(Math.random().toString(36) + Date.now().toString(), 12),
              },
            });
          } else {
            // Update existing user
            await safePrisma.user.update({
              where: { email: user.email! },
              data: {
                avatar: user.image,
                firstName: user.name?.split(" ")[0] || existingUser.firstName,
                lastName: user.name?.split(" ")[1] || existingUser.lastName,
              },
            });
          }
        } catch (err) {
          console.error("Error saving OAuth user:", err);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // When user first signs in
      if (user) {
        token.id = user.id
        token.role = user.role
        
        if ('adminType' in user) {
          token.adminType = user.adminType
          token.permissions = user.permissions
        }
        
        if ('firstName' in user) {
          token.firstName = user.firstName
          token.lastName = user.lastName
        }
      }

      // For existing sessions, refresh from database
      if (token.email) {
        // Check all user types
        const superAdmin = await safePrisma.superAdmin.findUnique({
          where: { email: token.email },
        })

        if (superAdmin) {
          token.id = superAdmin.id
          token.role = superAdmin.role
          token.adminType = "SUPER_ADMIN"
          token.permissions = superAdmin.permissions || []
          return token
        }

        const subAdmin = await safePrisma.subAdmin.findUnique({
          where: { email: token.email },
        })

        if (subAdmin) {
          token.id = subAdmin.id
          token.role = subAdmin.role
          token.adminType = "SUB_ADMIN"
          token.permissions = subAdmin.permissions || []
          return token
        }

        const regularUser = await safePrisma.user.findUnique({
          where: { email: token.email },
        })

        if (regularUser) {
          token.id = regularUser.id
          token.role = regularUser.role
          token.firstName = regularUser.firstName
          token.lastName = regularUser.lastName
          token.avatar = regularUser.avatar
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        
        if (token.adminType) {
          session.user.adminType = token.adminType as "SUPER_ADMIN" | "SUB_ADMIN"
          session.user.permissions = token.permissions as string[]
        }
        
        if (token.firstName) {
          session.user.firstName = token.firstName as string
          session.user.lastName = token.lastName as string
          session.user.avatar = token.avatar as string
        }
      }
      return session
    },
  },
}