import { Briefcase, Plus, X } from "lucide-react"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {workFields.map((field, index) => (
          <Card key={field.id} className="space-y-4 py-2 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`work_experiences.${index}.company_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
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
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Present"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`work_experiences.${index}.responsibilities`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              className="ml-2"
              onClick={() => removeWork(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() =>
            appendWork({
              company_name: "",
              position: "",
              start_date: "",
              end_date: null,
              responsibilities: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Add Work Experience
        </Button>
      </CardContent>
    </Card>
  )
}
