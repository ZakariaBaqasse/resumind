// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWRMutation from "swr/mutation"

import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { fetcher } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useDeleteJobApplication(id: string) {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = APPLICATION_BACKEND_ROUTES.deleteJobApplication(id)

  return useSWRMutation(
    url.toString(),
    fetcher<boolean>(session?.token, "DELETE")
  )
}
