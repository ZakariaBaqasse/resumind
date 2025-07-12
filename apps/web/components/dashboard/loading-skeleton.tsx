import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section Skeleton */}
        <div className="text-center">
          <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="w-80 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Base Resume Card Skeleton */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-200 rounded animate-pulse"></div>
                <div className="w-32 h-5 bg-blue-200 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-blue-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-blue-200 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-blue-200 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-blue-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-blue-200 rounded animate-pulse"></div>
                <div className="flex-1 h-8 bg-blue-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Create Resume Card Skeleton */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
              <div className="w-40 h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="w-48 h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>

          {/* Progress Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="pt-2">
                <div className="w-24 h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Resumes Section Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="w-64 h-9 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
