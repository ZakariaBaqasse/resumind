// hooks/onboarding/use-upload-resume.ts
import { useSession } from "next-auth/react"
import useSWRMutation from "swr/mutation"

import { USER_BACKEND_ROUTES } from "@/lib/routes"
import { APIError } from "@/lib/swr"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useUploadResume() {
  const { data: session } = useSession()
  const url = new URL(API_URL)
  url.pathname = USER_BACKEND_ROUTES.uploadResume

  async function uploadPdf(url: string, { arg }: { arg: File }) {
    const formData = new FormData()
    formData.append("file", arg)

    const res = await fetch(url, {
      method: "POST",
      // don't set JSON headers, the browser will do multipart/form-data for you
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      credentials: "include",
      body: formData,
    })

    if (!res.ok) {
      const contentType = res.headers.get("Content-Type") || ""
      let errData = { message: await res.text() }
      if (contentType.includes("application/json")) {
        errData = await res.json()
      }
      throw new APIError(errData, res.status, res.statusText)
    }

    return res.json()
  }

  return useSWRMutation(url.toString(), uploadPdf, {
    throwOnError: true,
  })
}
