"use client"

import ProtectedComponents from "@/components/auth/protected-component"

export default function ProtectedComponentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedComponents>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </ProtectedComponents>
  )
}
