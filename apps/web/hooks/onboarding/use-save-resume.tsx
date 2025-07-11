// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWRMutation from "swr/mutation"

import { Resume } from "@/types/resume.types"
import { User } from "@/types/user.types"
import { USER_BACKEND_ROUTES } from "@/lib/routes"
import { APIError, fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type SaveResumeArg = {
  resume: Resume
}

export function useSaveResume() {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = USER_BACKEND_ROUTES.saveResume

  return useSWRMutation(
    url.toString(),
    fetcher<User, SaveResumeArg>(session?.token, "POST"),
    {
      throwOnError: true,
    }
  )
}
