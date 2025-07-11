"use client"

import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"

import PageLoader from "../shared/page-loader"

const ProtectedComponents = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  if (status === "loading") {
    return <PageLoader />
  }

  if (status === "unauthenticated") {
    redirect("/auth/login")
  }
  return <>{children}</>
}

export default ProtectedComponents
