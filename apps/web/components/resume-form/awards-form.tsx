import { Plus, Trash2, Trophy } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

interface AwardsFormProps {
  control: Control<any>
  awardFields: FieldArrayWithId<any, any, any>[]
  appendAward: (value: any) => void
  removeAward: (index: number) => void
}

export function AwardsForm({
  control,
  awardFields,
  appendAward,
  removeAward,
}: AwardsFormProps) {
  const watchedAwards = useWatch({
    control,
    name: "awards",
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            Awards & Honors
          </CardTitle>
          <Button onClick={appendAward} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Award
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {awardFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">No awards added yet.</div>
        )}
        {awardFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-900">
                {watchedAwards?.[index]?.title || `Award ${index + 1}`}
              </h2>
              <Button
                onClick={() => removeAward(index)}
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
                name={`awards.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.issuer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date (YYYY-MM)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2023-06" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
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
