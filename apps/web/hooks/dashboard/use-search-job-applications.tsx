import { useState } from "react"
import { useSession } from "next-auth/react"
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite"

import { PaginatedJobApplicationsPreviews } from "@/types/application.types"
import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"
import { APIError, fetcher } from "@/lib/swr"

const LIMIT = 30
const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useJobApplicationsSearch(
  limit: number = LIMIT,
  options?: SWRInfiniteConfiguration<PaginatedJobApplicationsPreviews, APIError>
) {
  const { data: session } = useSession()
  const { token } = session as any
  const [searchTerm, setSearchTerm] = useState("")

  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedJobApplicationsPreviews | null
  ) => {
    // Don't fetch if no search term and no filters
    const hasSearchTerm = searchTerm.trim()

    if (!hasSearchTerm) return null

    // Reached the end
    if (previousPageData && !previousPageData.has_next) return null

    const url = new URL(API_URL!)
    url.pathname = APPLICATION_BACKEND_ROUTES.searchJobApplications

    // Add search term if provided
    if (hasSearchTerm) {
      url.searchParams.set("search_term", searchTerm)
    }

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

  const isEmpty = data?.[0]?.items?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.has_next === false)

  const jobApplicationsPreviews = data ? data.flatMap((page) => page.items) : []

  return {
    jobApplicationsPreviews,
    error,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    searchTerm,
    setSearchTerm,
    size,
    loadMore: () => setSize(size + 1),
    mutate,
    data,
  }
}
