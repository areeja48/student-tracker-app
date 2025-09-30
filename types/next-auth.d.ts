// src/types/next-auth.d.ts
import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
      image?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }

  interface User {
    role?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    email: string;
    role: string;
    picture?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}