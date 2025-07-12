import { GraduationCap, Plus, Trash2 } from "lucide-react"
import { Control, FieldArrayWithId, useWatch } from "react-hook-form"

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
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Education
          </CardTitle>
          <Button onClick={appendEducation} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {educationFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-900">
                {watchedEducations?.[index]?.degree &&
                watchedEducations?.[index]?.field_of_study
                  ? `${watchedEducations[index].degree} in ${watchedEducations[index].field_of_study}`
                  : `Education ${index + 1}`}
              </h2>
              <Button
                onClick={() => removeEducation(index)}
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
        ))}
      </CardContent>
    </Card>
  )
}
