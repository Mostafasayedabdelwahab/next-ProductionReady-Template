import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { loginUser } from "@/features/user/user.service";
import { Environments } from "@/lib/constants/enums";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { role: true, sessionVersion: true, passwordChangedAt: true },
        });

        token.id = user.id;
        token.role = dbUser?.role;
        token.sessionVersion = dbUser?.sessionVersion;
        token.passwordChangedAt = dbUser?.passwordChangedAt;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.sessionVersion = token.sessionVersion as number;
        session.user.passwordChangedAt = token.passwordChangedAt as Date;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/unauthorized",
    verifyRequest: "/",
    newUser: "/profile",
  },
};
