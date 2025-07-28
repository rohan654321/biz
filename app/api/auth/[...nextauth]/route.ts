// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // Mock user data (replace with DB check)
        const users = [
          { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", username: "admin", password: "admin123" },
          { id: "2", name: "Organizer User", email: "organizer@example.com", role: "organizer", username: "organizer", password: "organizer123" },
          { id: "3", name: "Superadmin User", email: "super@example.com", role: "superadmin", username: "superadmin", password: "superadmin123" },
        ];

        const user = users.find(u => u.username === username && u.password === password);

        if (user) return user;

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // store role in token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string; // pass role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
