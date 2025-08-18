// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWRMutation from "swr/mutation"

import { JobApplicationSnapshot } from "@/types/application.types"
import { User } from "@/types/user.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { APIError, fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type StartGenerationArgs = {
  job_role: string
  job_description: string
  company: string
}

export function useStartGeneration() {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = APPLICATION_BACKEND_ROUTES.start_generation
  return useSWRMutation(
    url.toString(),
    fetcher<JobApplicationSnapshot, StartGenerationArgs>(
      session?.token,
      "POST"
    ),
    {
      throwOnError: true,
    }
  )
}
