import { isNil } from "lodash"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { placeholderImage } from "./lib/utils"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string
      initialResume?: string | null
    }
    token?: string
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    initialResume?: string | null
    token?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const backendUrl = new URL(process.env.NEXT_PUBLIC_API_URL!)
          backendUrl.pathname = "/auth/credentials-login"
          // Call your backend API
          const response = await fetch(backendUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              username: credentials.email, // Note: backend expects 'username' not 'email'
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Login failed:", errorText)
            return null
          }

          const data = await response.json()
          // Return user data in the format NextAuth expects
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            // Store the token to be used in JWT callback
            token: data.access_token,
          }
        } catch (error) {
          console.error("Error during login:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials, ...rest }) {
      // Handle Google provider
      if (account?.provider === "google") {
        try {
          const backendUrl = new URL(process.env.NEXT_PUBLIC_API_URL!)
          backendUrl.pathname = "/auth/google-signin"
          const response = await fetch(backendUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_token: account.id_token,
              access_token: account.access_token,
            }),
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error("Backend authentication failed", errorText)
            return false
          }

          const data = await response.json()

          // Store both token and user data
          ;(account as any)._tempToken = data.access_token
          ;(account as any)._backendUser = data.user

          // Continue with sign in
        } catch (error) {
          console.error("Error during backend authentication:", error)
          return false
        }
      }
      // Always return a definite value (true or false)
      return true
    },

    async jwt({ token, account, user }) {
      // For Google OAuth, we already have the account._tempToken flow
      if (account && (account as any)._tempToken) {
        ;(token as any).customToken = (account as any)._tempToken
        ;(token as any).backendUser = (account as any)._backendUser
      }

      // For credentials login, the token comes from the user object
      if (user && (user as any).token) {
        ;(token as any).customToken = (user as any).token
        // Store user data from credentials login
        token.name = user.name || null
        token.email = user.email || null
        token.picture = user.image || null
        token.sub = user.id
        token.initialResume = (user as any).initialResume || null // Store initial resume if available
      }

      return token
    },

    async session({ session, token }) {
      // Add user ID and image from existing session callback
      if (!session || !session.user) {
        return session
      }

      // If we have backend user data from OAuth, use it directly
      if ((token as any).backendUser) {
        session.user = {
          ...session.user,
          ...(token as any).backendUser,
        }
      } else {
        // For credentials login - use token data instead of user
        // The token already has all user data from the JWT callback
        session.user = {
          ...session.user,
          id: token.sub || "", // User ID is stored in token.sub
          name: token.name || null,
          email: token.email || null,
          image:
            token.picture || (token.sub ? placeholderImage(token.sub) : null),
          initialResume: (token as any).initialResume || null,
        }
      }

      // Make the custom token available to the client
      if (token) {
        ;(session as any).token = (token as any).customToken
      }

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
}
