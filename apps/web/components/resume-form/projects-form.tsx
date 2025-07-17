import { FolderOpen, Plus, Trash2, X } from "lucide-react"
import { Control, FieldArrayWithId, useWatch } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface ProjectsFormProps {
  control: Control<any>
  projectFields: FieldArrayWithId<any, any, any>[]
  appendProject: (value: any) => void
  removeProject: (index: number) => void
}

export function ProjectsForm({
  control,
  projectFields,
  appendProject,
  removeProject,
}: ProjectsFormProps) {
  const watchedProjects = useWatch({
    control,
    name: "projects",
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            Projects
          </CardTitle>
          <Button onClick={appendProject} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">
            No projects added yet.
          </div>
        )}
        {projectFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-900">
                {watchedProjects?.[index]?.title || `Project ${index + 1}`}
              </h2>
              <Button
                onClick={() => removeProject(index)}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`projects.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label>Description</Label>
              <FormField
                control={control}
                name={`projects.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(field.technologies) &&
                  field.technologies.map((tech: string, techIndex: number) => (
                    <Badge
                      key={techIndex}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          const newTechnologies = [...field.technologies]
                          newTechnologies.splice(techIndex, 1)
                          // This would need to be handled by the parent component
                        }}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
              <div className="flex gap-2 mt-2">
                <FormField
                  control={control}
                  name={`projects.${index}.technologies`}
                  render={({ field: techField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Add technology"
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              const newTech = e.currentTarget.value.trim()
                              if (newTech) {
                                const currentTechs = Array.isArray(
                                  techField.value
                                )
                                  ? techField.value
                                  : []
                                techField.onChange([...currentTechs, newTech])
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
