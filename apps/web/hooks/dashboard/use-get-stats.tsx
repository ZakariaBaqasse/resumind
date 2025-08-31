// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWR from "swr"

import { User } from "@/types/user.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type StatsResponse = {
  total_created: number
  created_this_month: number
  completed: number
}

export function useGetStats() {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = APPLICATION_BACKEND_ROUTES.getStats

  return useSWR(url.toString(), fetcher<StatsResponse>(session?.token, "GET"))
}
