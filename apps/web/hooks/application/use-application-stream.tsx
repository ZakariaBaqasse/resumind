"use client"

import { useEffect, useRef } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import { useSession } from "next-auth/react"

import { APPLICATION_BACKEND_ROUTES } from "@/lib/routes"

// Prefer absolute URL if available; fall back to relative (same-origin proxy)
function buildStreamUrl(appId: string, token: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || ""
  const relative = APPLICATION_BACKEND_ROUTES.stream(appId, token)
  return base + relative
}

export function useApplicationStream(id: string) {
  const { updateSnapshot, setConnectionStatus, setError, clearError } =
    useApplicationStore()
  const { data: session } = useSession()
  const lastEventIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!id || !session?.token) {
      return
    }

    const url = buildStreamUrl(id, session.token)
    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      setConnectionStatus(true)
      clearError()
    }

    eventSource.onerror = () => {
      setConnectionStatus(false)
      // The browser will automatically try to reconnect.
    }

    const onSnapshot = (event: MessageEvent) => {
      try {
        if (event.lastEventId && event.lastEventId === lastEventIdRef.current) {
          return
        }
        lastEventIdRef.current = event.lastEventId

        const parsedData = JSON.parse(event.data)
        updateSnapshot(parsedData)
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error("Unknown error parsing data")
        )
      }
    }

    eventSource.addEventListener("application.snapshot", onSnapshot)

    // Optional: handle specific errors from the stream
    const onStreamError = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data)
        setError(new Error(parsed?.message || "SSE stream error"))
      } catch {
        setError(new Error("SSE stream error"))
      }
      eventSource.close()
    }

    eventSource.addEventListener("stream.error", onStreamError)

    return () => {
      console.log("Closing SSE connection.")
      eventSource.removeEventListener("application.snapshot", onSnapshot)
      eventSource.removeEventListener("stream.error", onStreamError)
      eventSource.close()
      setConnectionStatus(false)
    }
  }, [
    id,
    session?.token,
    updateSnapshot,
    setConnectionStatus,
    setError,
    clearError,
  ])

  // Return values from the store
  const snapshot = useApplicationStore((state) => state.snapshot)
  const isConnected = useApplicationStore((state) => state.isConnected)
  const error = useApplicationStore((state) => state.error)

  return { application: snapshot, isConnected, error }
}
