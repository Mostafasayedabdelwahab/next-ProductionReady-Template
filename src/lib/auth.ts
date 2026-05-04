import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { loginUser } from "@/features/user/user.service";
import { Environments } from "@/config/enums";
import { Role } from "@/generated/prisma/enums";
import { checkRateLimit } from "@/services/rate-limit";

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
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
        token.sessionVersion = user.sessionVersion;
        token.passwordChangedAt = user.passwordChangedAt;
        token.emailVerified = user.emailVerified;
        token.isActive = user.isActive;
      }

      // 🔥 validation on every request
      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            sessionVersion: true,
            passwordChangedAt: true,
            emailVerified: true,
            isActive: true,
            profile: {
              select: { image: true },
            },
          },
        });

        if (!dbUser) {
          throw new Error("UNAUTHORIZED");
        }

        // ✅ session invalidation
        if (dbUser.sessionVersion !== token.sessionVersion) {
          throw new Error("SESSION_EXPIRED");
        }

        // ✅ password change invalidation
        if (
          dbUser.passwordChangedAt &&
          token.passwordChangedAt &&
          new Date(dbUser.passwordChangedAt) > new Date(token.passwordChangedAt)
        ) {
          throw new Error("PASSWORD_CHANGED");
        }

        // update dynamic fields
        token.emailVerified = dbUser.emailVerified ?? null;
        token.picture = (dbUser.profile?.image as { url: string })?.url || null;
        token.isActive = dbUser.isActive;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
          role: token.role as Role,
          image: (token.picture as string) || null,
          sessionVersion: token.sessionVersion as number,
        };
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

        const rateLimitResult = await checkRateLimit("login", credentials.email);

        if (!rateLimitResult.success) {
          throw new Error("TOO_MANY_REQUESTS"); 
        }

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });

         if (!user.isActive) {
           throw new Error("ACCOUNT_DISABLED");
         }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          sessionVersion: user.sessionVersion,
          passwordChangedAt: user.passwordChangedAt,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
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
