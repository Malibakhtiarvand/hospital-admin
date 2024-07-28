import NextAuth from "next-auth/next"
import { next_Auth_options } from "./options"

const NextAuthController = NextAuth(next_Auth_options)
export { NextAuthController as GET, NextAuthController as POST }
