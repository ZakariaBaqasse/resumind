"use client"

import { ReactNode } from "react"

import ProtectedComponents from "@/components/auth/protected-component"

export default function ProtectedComponentsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ProtectedComponents>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </ProtectedComponents>
  )
}
