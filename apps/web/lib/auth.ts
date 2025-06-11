// API client for auth-related backend calls
import { User } from "@/types/user.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function signupUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email, // Backend expects 'username'
      password: password,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }

  return response.json()
}
