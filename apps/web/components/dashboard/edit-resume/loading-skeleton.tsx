import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EditResumeLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Text Skeleton */}
        <div className="mb-6">
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Form Skeleton */}
        <div className="space-y-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-9 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience Card */}
          <Card>
            <CardHeader>
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4 p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-full h-9 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card>
            <CardHeader>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(1)].map((_, i) => (
                <div key={i} className="space-y-4 p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-full h-9 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardHeader>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-9 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-9 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button Skeleton */}
          <div className="flex justify-end pt-6">
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
