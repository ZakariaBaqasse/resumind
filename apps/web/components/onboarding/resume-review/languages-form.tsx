import { Code, Languages, Plus, X } from "lucide-react"
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

interface LanguagesFormProps {
  control: Control<any>
  languageFields: FieldArrayWithId<any, any, any>[]
  appendLanguage: (value: any) => void
  removeLanguage: (index: number) => void
}

export function LanguagesForm({
  control,
  languageFields,
  appendLanguage,
  removeLanguage,
}: LanguagesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-blue-600" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {languageFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row md:items-center gap-2"
            >
              <FormField
                control={control}
                name={`languages.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Language" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`languages.${index}.proficiency`}
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
                onClick={() => removeLanguage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => appendLanguage({ name: "", proficiency: "Fluent" })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add language
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
