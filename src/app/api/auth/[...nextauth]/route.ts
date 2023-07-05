import NextAuth from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }