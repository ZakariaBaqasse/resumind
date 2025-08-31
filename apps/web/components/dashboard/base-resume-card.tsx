"use client"

import { motion } from "framer-motion"
import { Briefcase, Building2, Edit, Eye, FileText, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BaseResumeCardProps {
  resume: any
  onViewResume: () => void
  onEditResume: () => void
}

export function BaseResumeCard({
  resume,
  onViewResume,
  onEditResume,
}: BaseResumeCardProps) {
  const skillsCount = resume.skills?.length || 0
  const latestWorkExperience = resume.work_experiences?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-primary/10 via-ghost-white/80 to-primary/5 shadow-xl rounded-xl border-0 relative overflow-hidden">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm pointer-events-none rounded-xl" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5" />
            Your Base Resume
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              Primary
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-base">
              <span className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4" />
                Skills:
              </span>
              <span className="font-bold text-xl text-foreground">
                {skillsCount}
              </span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="flex items-center gap-1 text-primary">
                <Briefcase className="w-4 h-4" />
                Latest Role:
              </span>
              <span className="font-bold text-lg text-foreground">
                {latestWorkExperience?.position || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="flex items-center gap-1 text-primary">
                <Building2 className="w-4 h-4" />
                Company:
              </span>
              <span className="font-bold text-lg text-foreground">
                {latestWorkExperience?.company_name || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-primary text-white hover:bg-primary/90 transition"
              onClick={onViewResume}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent border-primary text-primary hover:bg-primary/10 transition"
              onClick={onEditResume}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
