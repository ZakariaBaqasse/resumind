"use client"

import { useEffect, useState } from "react"

export const PulsingDot = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    <div
      className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="w-1 h-1 bg-blue-300 rounded-full animate-pulse"
      style={{ animationDelay: "0.4s" }}
    ></div>
  </div>
)

export const ShimmerLoader = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    {children}
  </div>
)

export const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number
  suffix?: string
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  useEffect(() => {
    const duration = 1000
    const steps = 20
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])
  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  )
}

export function formatTimestamp(timestamp?: string | null) {
  if (!timestamp) return "Unknown"
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}
