"use client"

import { useMemo } from "react"
import { useApplicationStore } from "@/store/job-application-store"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Globe,
  Info,
  Loader2,
  Search,
} from "lucide-react"

import type {
  ApplicationEvent,
  DiscoveredCompanyProfile,
} from "@/types/application.types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import AnimatedEvent from "../animated-events"
import { AnimatedCounter } from "../common"

const EMPTY_EVENTS: ApplicationEvent[] = []

const formatURL = (url: string) => {
  if (!url.startsWith("https://")) {
    return "https://" + url
  }
  return url
}

export function DiscoveryCard() {
  // Count actual key links from the discovery data
  const companyProfile = useApplicationStore((state) =>
    state.getCompanyProfile()
  )
  const discovery = companyProfile?.company_discovery_results
  const events = useApplicationStore(
    (state) => state.snapshot?.events || EMPTY_EVENTS
  )
  const keyLinksCount = Object.keys(discovery?.key_properties || {}).filter(
    (key) =>
      discovery?.key_properties?.[key as keyof typeof discovery.key_properties]
  ).length

  // Determine discovery status from events
  const discoveryStatus = useMemo(() => {
    const discoveryEvents = events.filter(
      (e) => e.event_name === "pipeline.step" && e.step === "company_discovery"
    )

    if (discoveryEvents.length === 0) return "started"

    const latest = discoveryEvents.reduce((latest, current) => {
      const latestTime = latest.created_at ? Date.parse(latest.created_at) : 0
      const currentTime = current.created_at
        ? Date.parse(current.created_at)
        : 0
      return currentTime > latestTime ? current : latest
    })

    return latest.status || "started"
  }, [events])

  const latestToolEvent = useMemo(() => {
    return events.findLast(
      (e) => e.event_name === "tool.execution" && e.step === "company_discovery"
    )
  }, [events])

  const hostname = discovery?.official_website
    ? new URL(formatURL(discovery.official_website)).hostname
    : undefined
  const links = discovery?.key_properties || {}

  const getStatusBadge = () => {
    switch (discoveryStatus) {
      case "succeeded":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1 hover:bg-green-100 transition-colors">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        )
      case "started":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 hover:bg-blue-100 transition-colors">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> In Progress
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 px-3 py-1 hover:bg-red-100 transition-colors">
            <AlertTriangle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
            <Search className="w-3 h-3 mr-1" /> Unknown
          </Badge>
        )
    }
  }

  if (!discovery && discoveryStatus === "started") {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-purple-50/40 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-400">
        <CardHeader className="pb-4 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  Company Discovery
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>
        <div className="px-8 -mt-3 mb-2">
          <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
            This phase aims to identify the company’s official sources, size,
            and key links to anchor research. This ensures later steps are
            grounded in accurate company context.
          </p>
        </div>
        <CardContent>
          {latestToolEvent ? (
            <AnimatedEvent event={latestToolEvent} />
          ) : (
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 rounded-xl border border-blue-200/50">
              <div className="p-3 bg-blue-100/80 rounded-full">
                <Search className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-800 mb-1">
                  Launching Company Discovery
                </h4>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Initializing discovery tools...</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Add failed state fallback
  if (!discovery && discoveryStatus === "failed") {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50/40 via-rose-50/40 to-pink-50/40 backdrop-blur-sm shadow-lg border-l-4 border-l-red-400">
        <CardHeader className="pb-4 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  Company Discovery
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-4">{getStatusBadge()}</div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="px-8 -mt-3 mb-2">
            <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
              This phase aims to identify the company’s official sources, size,
              and key links to anchor research. This ensures later steps are
              grounded in accurate company context.
            </p>
          </div>
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-50/60 via-rose-50/60 to-pink-50/60 rounded-xl border border-red-200/50">
            <div className="p-3 bg-red-100/80 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-800 mb-1">
                Company Discovery Failed
              </h4>
              <p className="text-red-700 text-sm leading-relaxed mb-3">
                We encountered an issue while researching{" "}
                <strong>The company</strong>. This could be due to network
                issues, API limitations, or insufficient company information.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-600">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Discovery process encountered an error</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-green-100/50 border-l-4 border-l-green-500">
          <CardHeader className="pb-4 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                    Company Discovery
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">
                    {hostname ? `${hostname} • ` : ""}
                    {discovery?.discovery_confidence} confidence
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    <AnimatedCounter value={keyLinksCount} />
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    KEY LINKS
                  </p>
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-4 border-0 bg-white/80 backdrop-blur-sm shadow-sm">
          <TooltipProvider>
            <CardContent className="pt-8 px-8">
              <div className="px-8 -mt-3 mb-2">
                <p className="text-xs text-gray-500 text-center max-w-2xl mx-auto">
                  This phase aims to identify the company’s official sources,
                  size, and key links to anchor research. This ensures later
                  steps are grounded in accurate company context.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <div>
                      <span className="text-sm font-bold text-gray-700 block mb-1">
                        Official Website
                      </span>
                      {discovery?.official_website ? (
                        <a
                          href={discovery.official_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-bold"
                        >
                          {hostname}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not found</span>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-2 right-2">
                        <Info />
                      </TooltipTrigger>
                      <TooltipContent className="text-black bg-blue-50">
                        <p>
                          The company's primary domain used to verify official
                          information and anchor research.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Building className="w-6 h-6 text-gray-600" />
                    <div>
                      <span className="text-sm font-bold text-gray-700 block mb-1">
                        Company Size
                      </span>
                      <span className="text-gray-900 font-bold capitalize text-lg">
                        {discovery?.company_characteristics
                          ?.company_size_estimate || "Unknown"}
                      </span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-2 right-2">
                        <Info />
                      </TooltipTrigger>
                      <TooltipContent className="text-black bg-blue-50">
                        <p>
                          Estimated company size (employees). Helps tailor tone,
                          scope, and impact framing
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <span className="text-sm font-bold text-gray-700 block mb-1">
                        Information Quality
                      </span>
                      <Badge
                        className={
                          discovery?.discovery_confidence === "high"
                            ? "bg-green-50 text-green-700 border-green-200 px-3 py-1 hover:bg-green-100"
                            : discovery?.discovery_confidence === "medium"
                              ? "bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 hover:bg-orange-100"
                              : "bg-red-50 text-red-700 border-red-200 px-3 py-1 hover:bg-red-100"
                        }
                      >
                        {discovery?.discovery_confidence}
                      </Badge>
                    </div>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-2 right-2">
                        <Info />
                      </TooltipTrigger>
                      <TooltipContent className="text-black bg-blue-50">
                        <p>
                          Overall confidence in discovery results based on
                          source reliability and cross-source agreement. High =
                          strong signals from authoritative sources; Medium =
                          mixed signals; Low = sparse or weak signals.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {keyLinksCount > 0 && (
                <div className="pt-8 border-t border-gray-100">
                  <span className="text-base font-bold text-gray-800 block mb-4">
                    Quick Links:
                  </span>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {links.careers_page && (
                      <a
                        href={links.careers_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Careers page: insights into roles, teams, and hiring signals."
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Careers
                      </a>
                    )}
                    {links.engineering_blog && (
                      <a
                        href={links.engineering_blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Engineering blog: tech stack, culture, and recent projects."
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Engineering Blog
                      </a>
                    )}
                    {links.about_page && (
                      <a
                        href={links.about_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="About page: mission, values, and high‑level positioning."
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        About
                      </a>
                    )}
                    {links.contact_page && (
                      <a
                        href={links.contact_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Contact page: channels for outreach and stakeholder mapping."
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              )}

              {keyLinksCount === 0 && (
                <div className="pt-8 border-t border-gray-100">
                  <p className="text-gray-500 italic text-sm">
                    No additional links discovered yet.
                  </p>
                </div>
              )}
            </CardContent>
          </TooltipProvider>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
