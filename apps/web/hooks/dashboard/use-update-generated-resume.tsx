// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWRMutation from "swr/mutation"

import { JobApplicationSnapshot } from "@/types/application.types"
import { Resume } from "@/types/resume.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type UpdateGeneratedResumeArgs = {
  resume: Resume
}

export function useUpdateGeneratedResume(id: string) {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = APPLICATION_BACKEND_ROUTES.updateGeneratedResume(id)

  return useSWRMutation(
    url.toString(),
    fetcher<JobApplicationSnapshot, UpdateGeneratedResumeArgs>(
      session?.token,
      "PUT"
    )
  )
}
