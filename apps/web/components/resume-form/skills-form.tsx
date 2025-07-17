import { Code, Plus, X } from "lucide-react"
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

interface SkillsFormProps {
  control: Control<any>
  skillFields: FieldArrayWithId<any, any, any>[]
  appendSkill: (value: any) => void
  removeSkill: (index: number) => void
}

export function SkillsForm({
  control,
  skillFields,
  appendSkill,
  removeSkill,
}: SkillsFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            Skills
          </CardTitle>
          <Button onClick={appendSkill} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillFields.map((field, index) => (
            <div key={field.id}>
              {/* Inputs row */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Skill name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`skills.${index}.proficiency_level`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Proficiency level" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  onClick={() => removeSkill(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {/* Error messages row */}
              <div className="flex gap-2 -mt-2 mb-4">
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`skills.${index}.name`}
                    render={() => (
                      <FormItem>
                        <FormMessage className="min-h-[20px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`skills.${index}.proficiency_level`}
                    render={() => (
                      <FormItem>
                        <FormMessage className="min-h-[20px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-[40px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
