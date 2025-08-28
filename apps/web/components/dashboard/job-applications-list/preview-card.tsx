import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Loader2,
  Mail,
  MoreVertical,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react"

import { JobApplicationPreview } from "@/types/application.types"
import { useDeleteJobApplication } from "@/hooks/dashboard/use-delete-job-application"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const getStatusInfo = (status: string) => {
  switch (status) {
    case "processing_company_profile":
      return {
        label: "Company Research",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Building className="w-3 h-3" />,
      }
    case "processing_resume_generation":
      return {
        label: "Resume Generation",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <FileText className="w-3 h-3" />,
      }
    case "processing_cover_letter":
      return {
        label: "Cover Letter Generation",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <Mail className="w-3 h-3" />,
      }
    case "started":
      return {
        label: " Started",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Zap className="w-3 h-3" />,
      }
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      }
    case "failed":
      return {
        label: "Failed",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
      }
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <Clock className="w-3 h-3" />,
      }
  }
}

export default function JobApplicationPreviewCard({
  application,
  onDelete,
}: {
  application: JobApplicationPreview
  onDelete: () => void
}) {
  const statusInfo = getStatusInfo(application.resume_generation_status!)
  const router = useRouter()
  const { trigger, data, isMutating } = useDeleteJobApplication(application.id)
  useEffect(() => {
    if (data) {
      onDelete()
    }
  }, [data])
  const handleDelete = async () => {
    try {
      await trigger()
    } catch (error) {
      console.log("ERROR deleting job application: ", application.job_title)
    }
  }
  return (
    <Card key={application.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium text-gray-900 mb-2">
              {application.job_title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Building className="w-4 h-4" />
              {application.company_name}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/applications/${application.id}/view`)
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={application.resume_generation_status !== "completed"}
                onClick={() =>
                  router.push(`/applications/${application.id}/edit`)
                }
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit documents
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isMutating}
                className="text-red-600"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            className={`${statusInfo.color} flex items-center gap-1 px-2 py-1`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Badge>
        </div>
        <div className="text-xs text-gray-500">
          Created on {new Date(application.created_at).toLocaleDateString()}
        </div>
        <div className="flex gap-2 justify-end w-full">
          <div className="w-2/4 flex justify-end">
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                router.push(`/applications/${application.id}/view`)
              }
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
