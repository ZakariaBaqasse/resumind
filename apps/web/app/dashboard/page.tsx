"use client"

import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <>
      <h1>Welcome to dashboard {JSON.stringify(session)}</h1>
      <Button onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
    </>
  )
}
