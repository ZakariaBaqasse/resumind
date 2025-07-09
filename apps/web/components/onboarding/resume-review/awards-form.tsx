import { Plus, X } from "lucide-react"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Awards & Honors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {awardFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">No awards added yet.</div>
        )}
        {awardFields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            {index > 0 && <Separator />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`awards.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY-MM-DD" />
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
            <Button
              type="button"
              variant="destructive"
              className="ml-2"
              onClick={() => removeAward(index)}
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
            appendAward({
              title: "",
              issuer: "",
              date: null,
              description: null,
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Add Award
        </Button>
      </CardContent>
    </Card>
  )
}
