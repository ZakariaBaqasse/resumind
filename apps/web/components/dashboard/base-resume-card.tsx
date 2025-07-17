"use client"

import { Edit, Eye, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BaseResumeCardProps {
  resume: any
  onViewResume: () => void
  onEditResume: () => void
}

export function BaseResumeCard({
  resume,
  onViewResume,
  onEditResume,
}: BaseResumeCardProps) {
  const skillsCount = resume.skills?.length || 0
  const latestWorkExperience = resume.work_experiences?.[0]

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <FileText className="w-5 h-5" />
          Your Base Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Skills:</span>
            <span className="font-medium text-blue-900">{skillsCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Latest Role:</span>
            <span className="font-medium text-blue-900">
              {latestWorkExperience?.position || "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Company:</span>
            <span className="font-medium text-blue-900">
              {latestWorkExperience?.company_name || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onViewResume}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={onEditResume}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
