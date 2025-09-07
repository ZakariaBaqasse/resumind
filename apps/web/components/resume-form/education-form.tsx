import { GraduationCap, Plus, Trash2 } from "lucide-react"
import { Control, FieldArrayWithId, useWatch } from "react-hook-form"

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

interface EducationFormProps {
  control: Control<any>
  educationFields: FieldArrayWithId<any, any, any>[]
  appendEducation: (value: any) => void
  removeEducation: (index: number) => void
}

export function EducationForm({
  control,
  educationFields,
  appendEducation,
  removeEducation,
}: EducationFormProps) {
  const watchedEducations = useWatch({
    control,
    name: "educations",
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              Education
            </CardTitle>
            <CardDescription>
              Your educational background and qualifications
            </CardDescription>
          </div>
          <Button onClick={appendEducation} size="sm">
            <Plus className="mr-2 size-4" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {educationFields.map((edu, index) => (
          <div
            key={edu.id}
            className="space-y-4 p-4 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">
                {watchedEducations?.[index]?.degree &&
                watchedEducations?.[index]?.field_of_study
                  ? `${watchedEducations[index].degree} in ${watchedEducations[index].field_of_study}`
                  : `Education ${index + 1}`}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`educations.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
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
                  name={`educations.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
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
                  name={`educations.${index}.field_of_study`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
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
                  name={`educations.${index}.grade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/GPA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="N/A"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`educations.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (YYYY-MM)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2020-09" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`educations.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (YYYY-MM)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="2024-05 or leave empty for current"
                        />
                      </FormControl>
                      <FormMessage />
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
