import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image?: string | null;
      sessionVersion: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    sessionVersion: number;
    passwordChangedAt: Date | null;
    emailVerified: Date | null;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    sessionVersion: number;
    passwordChangedAt: Date | null;
    emailVerified: Date | null;
  }
}