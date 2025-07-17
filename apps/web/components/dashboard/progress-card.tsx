import { Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressCardProps {
  resumesCreated?: number
  resumesThisMonth?: number
  completedResumes?: number
  progressPercentage?: number
}

export function ProgressCard({
  resumesCreated = 0,
  resumesThisMonth = 3,
  completedResumes = 0,
  progressPercentage = 75,
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resumes created:</span>
            <span className="font-medium text-gray-900">{resumesCreated}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">This month:</span>
            <span className="font-medium text-gray-900">
              {resumesThisMonth}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed:</span>
            <span className="font-medium text-green-600">
              {completedResumes}
            </span>
          </div>
        </div>
        <div className="pt-2">
          <div className="text-xs text-gray-500 mb-1">Recent Activity</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
