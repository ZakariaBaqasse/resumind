import { Briefcase, Plus, Trash2, X } from "lucide-react"
import {
  Control,
  FieldArrayWithId,
  useFieldArray,
  useWatch,
} from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"

interface WorkExperienceFormProps {
  control: Control<any>
  workFields: FieldArrayWithId<any, any, any>[]
  appendWork: (value: any) => void
  removeWork: (index: number) => void
}

export function WorkExperienceForm({
  control,
  workFields,
  appendWork,
  removeWork,
}: WorkExperienceFormProps) {
  const watchedWorkExperiences = useWatch({
    control,
    name: "work_experiences",
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Work Experience
          </CardTitle>
          <Button onClick={appendWork} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {workFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-900">
                {watchedWorkExperiences?.[index]?.position ||
                  `Experience ${index + 1}`}
              </h2>

              <Button
                onClick={() => removeWork(index)}
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
                name={`work_experiences.${index}.company_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`work_experiences.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`work_experiences.${index}.start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (YYYY-MM)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2021-03" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`work_experiences.${index}.end_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (YYYY-MM)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="2023-05 or leave empty for current"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label>Responsibilities</Label>
              <div className="space-y-2 mt-2">
                <FormField
                  control={control}
                  name={`work_experiences.${index}.responsibilities`}
                  render={({ field: respField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea {...respField} rows={5} className="flex-1" />
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
