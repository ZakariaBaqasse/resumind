// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWR from "swr"

import { User } from "@/types/user.types"
import { USER_BACKEND_ROUTES } from "@/lib/routes"
import { fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useGetUser() {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = USER_BACKEND_ROUTES.saveResume

  return useSWR(url.toString(), fetcher<User>(session?.token, "GET"))
}
