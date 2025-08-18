"use client"

import { useParams } from "next/navigation"

import { useApplicationStream } from "@/hooks/application/use-application-stream"
import ApplicationStatus from "@/components/application"
import PageLoader from "@/components/shared/page-loader"

export default function ApplicationStatusPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { application, isConnected, error } = useApplicationStream(id)

  if (error && !application) {
    return <p>Error: {error.message}</p>
  }

  if (!application) {
    return <PageLoader />
  }

  return <ApplicationStatus />
}
