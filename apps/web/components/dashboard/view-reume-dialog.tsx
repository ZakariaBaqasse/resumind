import { Badge, Edit, FileText } from "lucide-react"

import { Resume } from "../../types/resume.types"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

type ViewResumeDialogProps = {
  isViewingResume: boolean
  setIsViewingResume: (isViewingResume: boolean) => void
  detailedResume: Resume
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

export default function ViewResumeDialog({
  isViewingResume,
  setIsViewingResume,
  detailedResume,
}: ViewResumeDialogProps) {
  return (
    <Dialog open={isViewingResume} onOpenChange={setIsViewingResume}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {detailedResume.name} - Base Resume
          </DialogTitle>
          <DialogDescription>
            Your complete resume information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.name}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Professional Title:
                </span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.personal_info.professional_title}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Age:</span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.personal_info.age}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.email}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.personal_info.phone_number}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">
                  {detailedResume.personal_info.address}
                </span>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block mb-2">
                Professional Summary:
              </span>
              <p className="text-gray-900 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
                {detailedResume.personal_info.summary}
              </p>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Work Experience
            </h3>
            <div className="space-y-4">
              {detailedResume.work_experiences.map((experience, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {experience.position}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {experience.company_name}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(experience.start_date)} -{" "}
                      {experience.end_date && experience.end_date !== "Present"
                        ? formatDate(experience.end_date)
                        : "Present"}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {experience.responsibilities}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Education
            </h3>
            <div className="space-y-3">
              {detailedResume.educations.map((education, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {education.degree} in {education.field_of_study}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {education.institution}
                      </p>
                      {education.grade !== "Not provided" && (
                        <p className="text-sm text-gray-600">
                          Grade: {education.grade}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(education.start_date)} -{" "}
                      {education.end_date && education.end_date !== "Present"
                        ? formatDate(education.end_date)
                        : "Present"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {detailedResume.skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="font-medium text-gray-900">{skill.name}</div>
                  {skill.proficiency_level &&
                    skill.proficiency_level !== "Not provided" && (
                      <div className="text-sm text-gray-600">
                        {skill.proficiency_level}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {detailedResume.projects && detailedResume.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Projects
              </h3>
              <div className="space-y-4">
                {detailedResume.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {project.title}
                      </h4>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {detailedResume.certifications &&
            detailedResume.certifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {detailedResume.certifications.map((certification, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {certification.name}
                          </h4>
                          <p className="text-blue-600 text-sm">
                            {certification.issuer}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDate(certification.issue_date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Languages */}
          {detailedResume.languages && detailedResume.languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {detailedResume.languages.map((language, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium text-gray-900">
                      {language.name}
                    </div>
                    {language.proficiency &&
                      language.proficiency !== "Not provided" && (
                        <div className="text-sm text-gray-600">
                          {language.proficiency}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsViewingResume(false)}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
