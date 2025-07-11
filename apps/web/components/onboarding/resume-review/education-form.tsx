import { GraduationCap, Plus, X } from "lucide-react"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {educationFields.map((field, index) => (
          <div key={field.id} className="space-y-6">
            {index > 0 && <Separator />}
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
                    <FormLabel>Grade</FormLabel>
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
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() =>
            appendEducation({
              institution: "",
              degree: "",
              field_of_study: "",
              start_date: "",
              end_date: null,
              grade: null,
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Add Education
        </Button>
      </CardContent>
    </Card>
  )
}
