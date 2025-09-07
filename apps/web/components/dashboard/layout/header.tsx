"use client"

import { usePathname } from "next/navigation"
import { useApplicationStore } from "@/store/job-application-store"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/base-resume": "Base Resume",
  "/dashboard/applications": "Applications",
}

export function Header() {
  const pathname = usePathname()
  const applicationTitle = useApplicationStore(
    (state) => state.snapshot?.job_title
  )
  const currentPageLabel =
    routeLabels[pathname] || applicationTitle || "Job Application"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2  bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {pathname !== "/dashboard" && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
