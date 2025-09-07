import { CodeXml, Plus, Trash2, X } from "lucide-react"
import { Control, FieldArrayWithId, useWatch } from "react-hook-form"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

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
          <div>
            <CardTitle className="flex items-center gap-2">
              <CodeXml className="size-5 text-primary" />
              Projects
            </CardTitle>
            <CardDescription>Your most shining projects</CardDescription>
          </div>
          <Button onClick={appendProject} size="sm">
            <Plus className="mr-2 size-4" />
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
            className="space-y-4 p-4 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">
                {watchedProjects?.[index]?.title || `Project ${index + 1}`}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
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
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`projects.${index}.technologies`}
                  render={({ field: techField }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add technology and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              const newTech = e.currentTarget.value.trim()
                              if (newTech) {
                                const currentTechs = Array.isArray(
                                  techField.value
                                )
                                  ? techField.value
                                  : []
                                if (!currentTechs.includes(newTech)) {
                                  techField.onChange([...currentTechs, newTech])
                                  e.currentTarget.value = ""
                                }
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex flex-wrap gap-2 pt-2">
                        {Array.isArray(techField.value) &&
                          techField.value.map(
                            (tech: string, techIndex: number) => (
                              <Badge
                                key={`${tech}-${techIndex}`}
                                className="flex items-center gap-1"
                                variant="secondary"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTechnologies = [...techField.value]
                                    newTechnologies.splice(techIndex, 1)
                                    techField.onChange(newTechnologies)
                                  }}
                                  className="ml-1 rounded-full hover:bg-destructive/80 p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            )
                          )}
                      </div>
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
