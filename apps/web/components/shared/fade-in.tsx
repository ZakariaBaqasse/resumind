"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  stagger?: number
  staggerChildren?: boolean
}

export function FadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  className = "",
  stagger = 100,
  staggerChildren = false,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(30px)"
        case "down":
          return "translateY(-30px)"
        case "left":
          return "translateX(30px)"
        case "right":
          return "translateX(-30px)"
        default:
          return "none"
      }
    }
    return "none"
  }

  const baseStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  }

  if (staggerChildren) {
    return (
      <div ref={ref} className={className} style={baseStyle}>
        {Array.isArray(children)
          ? children.map((child, index) => (
              <FadeIn
                key={index}
                delay={delay + index * stagger}
                duration={duration}
                direction={direction}
              >
                {child}
              </FadeIn>
            ))
          : children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  )
}
