import { BaseResumeCard } from "./base-resume-card"
import { CreateResumeCard } from "./create-resume-card"
import { ProgressCard } from "./progress-card"

interface QuickActionsProps {
  resume: any
  onViewResume: () => void
  onEditResume: () => void
}

export function QuickActions({
  resume,
  onViewResume,
  onEditResume,
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseResumeCard
        resume={resume}
        onViewResume={onViewResume}
        onEditResume={onEditResume}
      />
      <CreateResumeCard />
      <ProgressCard />
    </div>
  )
}
