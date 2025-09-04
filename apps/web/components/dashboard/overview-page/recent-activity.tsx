import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowUpRight,
  Building,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react"

import { useJobApplications } from "@/hooks/dashboard/use-get-job-applications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusInfo } from "@/components/shared/job-applications.utils"

export function RecentActivity() {
  const { applicationsPreviews, error, isLoading, mutate } =
    useJobApplications(5)
  const router = useRouter()
  return (
    <Card
      className="animate-in slide-in-from-bottom-4"
      style={{ animationDelay: "400ms" }}
    >
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Your latest resume and cover letter generations
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex bg-transparent"
            onClick={() => router.push("/dashboard/applications")}
          >
            View All
            <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="size-4" />
              Failed to load recent activity.
            </div>
            <Button size="sm" variant="outline" onClick={() => mutate()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <div className="divide-y divide-border/50">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-xl bg-muted/50" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-28 rounded-md" />
                  <div className="hidden sm:block">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : applicationsPreviews.length > 0 ? (
          <div className="divide-y divide-border/50 cursor-pointer">
            {applicationsPreviews.map((item, index) => {
              const statusConfig = getStatusInfo(item.resume_generation_status!)

              return (
                <div
                  key={index}
                  className="group flex items-center justify-between p-6 transition-colors duration-200 hover:bg-muted/5"
                  onClick={() => router.push(`/applications/${item.id}/view`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-muted/20 transition-colors duration-200 group-hover:bg-primary/10">
                      <FileText className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground leading-tight">
                        {item.job_title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.company_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <Badge
                      className={`${statusConfig.color} flex items-center gap-1 px-2 py-1`}
                    >
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </Badge>
                    <div className="hidden text-sm text-muted-foreground sm:block">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Clock className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No recent activity
            </h3>
            <p className="text-muted-foreground text-pretty max-w-sm">
              Start by generating your first job application to see your
              activity here.
            </p>
            <div className="flex gap-2 mt-6">
              <Button size="sm">
                <Sparkles className="mr-2 size-4" />
                Generate Application
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
