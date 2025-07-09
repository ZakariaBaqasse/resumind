import { Plus, X } from "lucide-react"
import { Control, FieldArrayWithId } from "react-hook-form"

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">
            No projects added yet.
          </div>
        )}
        {projectFields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            {index > 0 && <Separator />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`projects.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`projects.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`projects.${index}.technologies`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        Array.isArray(field.value)
                          ? field.value.join(", ")
                          : field.value || ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((t: string) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="e.g. React, Node.js, PostgreSQL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              className="ml-2"
              onClick={() => removeProject(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() =>
            appendProject({
              title: "",
              description: "",
              technologies: [],
              url: null,
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </Button>
      </CardContent>
    </Card>
  )
}
