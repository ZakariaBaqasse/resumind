import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Building,
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import { JobApplicationPreview } from "@/types/application.types"
import { cn } from "@/lib/utils"
import { useDeleteJobApplication } from "@/hooks/dashboard/use-delete-job-application"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getStatusInfo } from "@/components/shared/job-applications.utils"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface JobApplicationPreviewCardProps {
  app: JobApplicationPreview
  onDelete: () => void
}

export default function JobApplicationPreviewCard({
  app,
  onDelete,
}: JobApplicationPreviewCardProps) {
  const statusConfig = getStatusInfo(app.resume_generation_status!)
  const router = useRouter()
  const { trigger, data, isMutating } = useDeleteJobApplication(app.id)
  useEffect(() => {
    if (data) {
      onDelete()
    }
  }, [data])
  const handleDelete = async () => {
    try {
      await trigger()
    } catch (error) {
      console.log("ERROR deleting job application: ", app.job_title)
    }
  }
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <>
      <Card
        key={app.id}
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-md animate-in slide-in-from-bottom-4"
        style={{ animationDelay: `${Math.random() * 200}ms` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted/50 transition-colors duration-200 group-hover:bg-primary/10">
                <Briefcase className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base leading-tight">
                  {app.job_title}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building className="size-3" />
                  {app.company_name}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/applications/${app.id}/view`)}
                >
                  <Eye className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={app.resume_generation_status !== "completed"}
                  onClick={() => router.push(`/applications/${app.id}/edit`)}
                >
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Job Title</span>
            </div>
            <p className="text-sm text-muted-foreground">{app.job_title}</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              className={`${statusConfig.color} flex items-center gap-1 px-2 py-1`}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {formatDate(app.created_at)}
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job application? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isMutating}
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
