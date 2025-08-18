"use client"

import { CheckCircle, Clock, Loader2, X, XCircle } from "lucide-react"

import type { ApplicationEvent } from "@/types/application.types"
import { Button } from "@/components/ui/button"

import { formatTimestamp } from "./common"

function getTime(e: ApplicationEvent) {
  return e.created_at ? Date.parse(e.created_at) : 0
}

function argsSummary(e: ApplicationEvent) {
  const summary = (e.data as any)?.args_summary
  if (!summary) return ""
  if (typeof summary === "string") return summary
  if (summary.query) return String(summary.query)
  if (summary.url) return String(summary.url)
  try {
    return JSON.stringify(summary)
  } catch {
    return ""
  }
}

function dedupeLatestToolExecutions(events: ApplicationEvent[]) {
  const map = new Map<
    string,
    { latest: ApplicationEvent; label: string; key: string }
  >()

  events
    .filter((e) => e.event_name === "tool.execution")
    .forEach((e) => {
      const key = `${e.step || ""}|${e.tool_name || ""}|${argsSummary(e)}`
      const label =
        e.message ||
        (e.tool_name ? `Executing ${e.tool_name}` : "Tool execution")

      const existing = map.get(key)
      if (!existing || getTime(e) > getTime(existing.latest)) {
        map.set(key, { latest: e, label, key })
      }
    })

  const items = Array.from(map.values())
  const running = items
    .filter((i) => i.latest.status === "started")
    .sort((a, b) => getTime(b.latest) - getTime(a.latest))
  const completed = items
    .filter(
      (i) => i.latest.status === "succeeded" || i.latest.status === "failed"
    )
    .sort((a, b) => getTime(b.latest) - getTime(a.latest))

  return { running, completed }
}

export function ActivitySidebar({
  events,
  onClose,
}: {
  events: ApplicationEvent[]
  onClose: () => void
}) {
  const { running, completed } = dedupeLatestToolExecutions(events)

  return (
    <div className="w-80 border-l border-gray-200/50 bg-white/80 backdrop-blur-sm overflow-auto">
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Tool activity</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            Running now {running.length ? `(${running.length})` : ""}
          </div>
          <div className="space-y-3">
            {running.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No tools running.
              </div>
            ) : (
              running.map(({ latest, label, key }) => (
                <div
                  key={key}
                  className="flex items-start gap-4 text-sm p-4 bg-white/70 rounded-xl border border-gray-100/50"
                >
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 font-semibold break-words">
                      {label}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {latest.tool_name ? (
                        <span>{latest.tool_name}</span>
                      ) : null}
                      {latest.step ? <span>• {latest.step}</span> : null}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(latest.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            Completed {completed.length ? `(${completed.length})` : ""}
          </div>
          <div className="space-y-3">
            {completed.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No completed tool executions.
              </div>
            ) : (
              completed.map(({ latest, label, key }) => (
                <div
                  key={key}
                  className="flex items-start gap-4 text-sm p-4 bg-white/70 rounded-xl border border-gray-100/50"
                >
                  {latest.status === "succeeded" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 font-semibold break-words">
                      {label}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {latest.tool_name ? (
                        <span>{latest.tool_name}</span>
                      ) : null}
                      {latest.step ? <span>• {latest.step}</span> : null}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(latest.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
