"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
} from "lucide-react"

import { useJobApplications } from "@/hooks/dashboard/use-get-job-applications"
import { useJobApplicationsSearch } from "@/hooks/dashboard/use-search-job-applications"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ContentLoader } from "../job-applications-list/content-loader"
import JobApplicationPreviewCard from "./preview-card"

export function ApplicationsPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Browse mode (existing)
  const {
    applicationsPreviews: browseApps,
    error: browseError,
    isLoading: browseLoading,
    isReachingEnd: browseReachingEnd,
    isEmpty: browseEmpty,
    setSize: setBrowseSize,
    size: browseSize,
    isLoadingMore: browseLoadingMore,
    data: browseData,
    mutate,
  } = useJobApplications()

  // Search mode (new)
  const {
    jobApplicationsPreviews: searchApps,
    error: searchError,
    isLoading: searchLoading,
    isReachingEnd: searchReachingEnd,
    searchTerm,
    setSearchTerm,
    loadMore: searchLoadMore,
    isLoadingMore: searchLoadingMore,
    data: searchData,
    size: searchSize,
  } = useJobApplicationsSearch()

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadMore = useCallback(() => {
    if (isSearchMode) {
      searchLoadMore()
    } else {
      setBrowseSize(browseSize + 1)
    }
  }, [isSearchMode, searchLoadMore, setBrowseSize, browseSize])

  // Current data source based on mode
  const currentApps = isSearchMode ? searchApps : browseApps
  const currentError = isSearchMode ? searchError : browseError
  const currentLoading = isSearchMode ? searchLoading : browseLoading
  const currentReachingEnd = isSearchMode
    ? searchReachingEnd
    : browseReachingEnd
  const currentLoadingMore = isSearchMode
    ? searchLoadingMore
    : browseLoadingMore
  const currentEmpty = isSearchMode ? searchApps.length === 0 : browseEmpty

  // Get total count from backend response
  const totalCount = useMemo(() => {
    if (isSearchMode) {
      // Get total from search data (first page contains the total)
      return searchData?.[0]?.total ?? 0
    } else {
      // Get total from browse data (first page contains the total)
      return browseData?.[0]?.total ?? 0
    }
  }, [isSearchMode, searchData, browseData])

  // Check if content height is less than viewport height on initial load and after data changes
  useEffect(() => {
    if (
      !currentLoading &&
      !currentLoadingMore &&
      currentApps.length > 0 &&
      !currentReachingEnd
    ) {
      const container = scrollContainerRef.current
      if (container) {
        // If scrollable content is smaller than container height, load more
        const shouldLoadMore = container.scrollHeight <= container.clientHeight
        if (shouldLoadMore) {
          loadMore()
        }
      }
    }
  }, [
    currentApps,
    currentLoading,
    currentLoadingMore,
    currentReachingEnd,
    loadMore,
  ])
  const handleApplyFilters = useCallback(() => {
    setIsSearchMode(true)
    setSearchTerm(searchQuery.trim())
  }, [searchQuery, setSearchTerm])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleApplyFilters()
      }
    },
    [handleApplyFilters]
  )

  const handleClearFilters = useCallback(() => {
    setIsSearchMode(false)
    setSearchQuery("")
    setSearchTerm("")
  }, [setSearchTerm])

  // Handle scroll event to detect when user is near bottom
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (
      container &&
      !currentLoading &&
      !currentLoadingMore &&
      !currentReachingEnd
    ) {
      const { scrollTop, scrollHeight, clientHeight } = container
      // Load more when user has scrolled to 80% of the way down
      const scrollPosition = scrollTop + clientHeight
      const scrollThreshold = scrollHeight * 0.8

      if (scrollPosition >= scrollThreshold) {
        loadMore()
      }
    }
  }, [currentLoading, currentLoadingMore, currentReachingEnd, loadMore])

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Handle scroll event to detect when user is near bottom

  // Error message
  const errorMessage = useMemo(() => {
    if (isSearchMode && searchError) return "Search failed. Please try again."
    if (!isSearchMode && browseError)
      return "Failed to load apps. Please try again."
    return null
  }, [isSearchMode, searchError, browseError])

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Applications
          </h1>
          <p className="text-muted-foreground text-pretty">
            Manage your generated resumes and cover letters
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      {isSearchMode && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <span className="text-xs text-blue-700">
            Filtered results • {totalCount} job applications found
            {searchTerm && ` for "${searchTerm}"`}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 p-4 my-4 bg-red-50 rounded mx-4">
          {errorMessage}
        </div>
      )}

      <div>
        {currentLoading && currentApps.length === 0 ? (
          <ContentLoader />
        ) : (
          <div
            className="overflow-y-auto overflow-x-hidden p-2"
            ref={scrollContainerRef}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {currentApps.map((app, idx) => (
                <div key={app.id} className="h-full">
                  <JobApplicationPreviewCard
                    app={app}
                    onDelete={async () => await mutate()}
                  />
                </div>
              ))}
              {currentLoadingMore && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col animate-pulse">
                  <div className="p-3 grow flex flex-col h-full">
                    <div className="flex items-center justify-start gap-4">
                      <div className="w-[18px] h-[18px] bg-gray-200 rounded-md" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                    <div className="my-2">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                    <div className="mt-auto">
                      <div className="h-3 w-16 bg-gray-200 rounded mt-2" />
                      <div className="h-8 w-full bg-gray-200 rounded mt-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isSearchMode && currentApps.length === 0 && !currentLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">
                  No apps match your current filters
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="link"
                  className="text-sm"
                >
                  Clear filters and browse all apps
                </Button>
              </div>
            )}

            {!isSearchMode && currentEmpty && !currentLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No apps available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
