const PreviewCardSkeleton = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow animate-pulse">
    <div className="p-6 pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-6 rounded-full bg-gray-200" />
      </div>
    </div>
    <div className="p-6 pt-0 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 rounded-md bg-gray-200" />
      </div>
      <div className="h-3 w-1/3 rounded bg-gray-200" />
      <div className="flex w-full justify-end">
        <div className="h-9 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  </div>
)

const ContentLoader = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PreviewCardSkeleton key={i} />
      ))}
    </div>
  )
}

export { ContentLoader }
