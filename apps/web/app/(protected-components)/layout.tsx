"use client"

import { ReactNode } from "react"
import { useSession } from "next-auth/react"

import ProtectedComponents from "@/components/auth/protected-component"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data: session } = useSession()
  return (
    <ProtectedComponents>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        {children}
      </div>
    </ProtectedComponents>
  )
}
