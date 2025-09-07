import { Briefcase, Plus, Trash2 } from "lucide-react"
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
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

interface WorkExperienceFormProps {
  control: Control<any>
  workFields: FieldArrayWithId<any, any, any>[]
  appendWork: (value: any) => void
  removeWork: (index: number) => void
}

export default function WorkExperienceForm({
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
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Work Experience
            </CardTitle>
            <CardDescription>
              Your professional work history and achievements
            </CardDescription>
          </div>
          <Button onClick={appendWork} size="sm">
            <Plus className="mr-2 size-4" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {workFields.map((exp, index) => (
          <div
            key={exp.id}
            className="space-y-4 p-4 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">
                {watchedWorkExperiences?.[index]?.position ||
                  `Experience ${index + 1}`}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWork(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
            </div>
            {/* <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) =>
                  updateWorkExperience(exp.id, "current", e.target.checked)
                }
                className="rounded border-border"
              />
              <Label htmlFor={`current-${exp.id}`}>
                Currently working here
              </Label>
            </div> */}
            <div className="space-y-2">
              <Label>Responsibilities</Label>
              <div className="space-y-2 mt-2">
                <FormField
                  control={control}
                  name={`work_experiences.${index}.responsibilities`}
                  render={({ field: respField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea {...respField} rows={10} className="flex-1" />
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
