// src/services/appService.ts
import { useSession } from "next-auth/react"
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite"

import { PaginatedJobApplicationsPreviews } from "@/types/application.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { APIError, fetcher } from "@/lib/swr"

const LIMIT = 30
const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useJobApplications(
  limit: number = LIMIT,
  options?: SWRInfiniteConfiguration<PaginatedJobApplicationsPreviews, APIError>
) {
  const { data: session } = useSession()
  const { token } = session as any
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedJobApplicationsPreviews | null
  ) => {
    // Reached the end
    if (previousPageData && !previousPageData.has_next) return null

    const url = new URL(API_URL!)
    url.pathname = APPLICATION_BACKEND_ROUTES.listJobApplications
    url.searchParams.set("offset", `${pageIndex * limit}`)
    url.searchParams.set("limit", `${limit}`)
    return url.toString()
  }

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PaginatedJobApplicationsPreviews>(
      getKey,
      fetcher<PaginatedJobApplicationsPreviews, APIError>(token, "GET"),
      options
    )

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.items.length === 0
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.has_next)

  // Flatten all pages of apps into a single array
  const applicationsPreviews = data ? data.flatMap((page) => page.items) : []

  return {
    applicationsPreviews,
    error,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    isEmpty,
    size,
    setSize,
    mutate,
    data,
  }
}
