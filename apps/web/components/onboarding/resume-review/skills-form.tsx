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
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skillFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row md:items-center gap-2"
            >
              <FormField
                control={control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Skill name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`skills.${index}.proficiency_level`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Proficiency</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Proficiency level" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                className="ml-2"
                onClick={() => removeSkill(index)}
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
              appendSkill({ name: "", proficiency_level: "Beginner" })
            }
          >
            <Plus className="w-4 h-4 mr-1" /> Add Skill
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
