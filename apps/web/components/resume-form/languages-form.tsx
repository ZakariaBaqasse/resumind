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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-600" />
            Languages
          </CardTitle>
          <Button onClick={appendLanguage} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {languageFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">
            No languages added yet.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {languageFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
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
                onClick={() => removeLanguage(index)}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
