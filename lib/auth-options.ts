// lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // ✅ Add this
    };
  }

  interface User {
    role?: string; // ✅ Add this
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // ✅ Add this
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          };
        }

        if (credentials?.username === "organizer" && credentials?.password === "organizer123") {
          return {
            id: "2",
            name: "Organizer User",
            email: "organizer@example.com",
            role: "organizer",
          };
        }

        if (credentials?.username === "superadmin" && credentials?.password === "superadmin123") {
          return {
            id: "3",
            name: "Super Admin User",
            email: "mainadmin@example.com",
            role: "superadmin",
          };
        }

        return null;
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
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role as string;
      return session;
    },
  },
};
