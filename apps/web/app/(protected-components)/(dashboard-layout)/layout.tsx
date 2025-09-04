"use client"

import type React from "react"
import { useState } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/dashboard/layout/header"
import { Sidebar } from "@/components/dashboard/layout/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <SidebarProvider
      open={!sidebarCollapsed}
      onOpenChange={(open) => setSidebarCollapsed(!open)}
    >
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        <SidebarInset className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
