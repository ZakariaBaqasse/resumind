// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWR from "swr"

import { JobApplicationSnapshot } from "@/types/application.types"
import { User } from "@/types/user.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useGetJobApplication(application_id: string) {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = APPLICATION_BACKEND_ROUTES.getJobApplication(application_id)

  return useSWR(
    url.toString(),
    fetcher<JobApplicationSnapshot>(session?.token, "GET")
  )
}
