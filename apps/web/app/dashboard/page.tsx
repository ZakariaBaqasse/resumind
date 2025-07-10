"use client"

import ProtectedComponents from "@/components/auth/protected-component"
import DashboardComponent from "@/components/dashboard"

export default function Dashboard() {
  return (
    <ProtectedComponents>
      <DashboardComponent />
    </ProtectedComponents>
  )
}
