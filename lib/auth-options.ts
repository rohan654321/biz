import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
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
      avatar?: string | null
    }
  }
  interface User {
    id: string
    role: string
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    firstName?: string
    lastName?: string
    avatar?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ LinkedIn Provider
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
          return null
        }

        try {
        
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
    async signIn({ user, account, profile }) {
    if (account?.provider === "google" || account?.provider === "linkedin") {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If user doesn’t exist → create new user in DB
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: user.name?.split(" ")[0] || "User",
              lastName: user.name?.split(" ")[1] || "",
              avatar: user.image,
              role: "ATTENDEE", // default role for social logins
              isVerified: true,
              emailVerified: true,
            },
          });
        } else {
          // Optional: update avatar or name if changed
          await prisma.user.update({
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
    // ✅ FIXED: Properly attach DB user data to JWT
  async jwt({ token, user }) {
    // When user first signs in
    if (user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.firstName = dbUser.firstName;
        token.lastName = dbUser.lastName;
        token.avatar = dbUser.avatar;
      }
    }
    return token;
  },

  // ✅ FIXED: Include role/id/avatar in session object
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.avatar = token.avatar as string;
    }
    return session;
  },
},
}
