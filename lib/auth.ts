import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET
const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

if (!googleClientId) {
  throw new Error('Missing GOOGLE_CLIENT_ID environment variable.')
}
if (!googleClientSecret) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET environment variable.')
}
if (!nextAuthSecret) {
  throw new Error('Missing NEXTAUTH_SECRET environment variable.')
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return false
      if (allowedEmails.length === 0) return true
      return allowedEmails.includes(profile.email.toLowerCase())
    },
    async jwt({ token, profile }) {
      if (profile?.email) token.email = profile.email
      if (profile?.name) token.name = profile.name
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.email) session.user.email = token.email as string
        if (token.name) session.user.name = token.name as string
      }
      return session
    },
  },
}
