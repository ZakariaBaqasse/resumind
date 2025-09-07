import { Briefcase, Plus, Trash2, Trophy } from "lucide-react"
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

interface AwardsFormProps {
  control: Control<any>
  awardsFields: FieldArrayWithId<any, any, any>[]
  appendAward: (value: any) => void
  removeAward: (index: number) => void
}

export default function AwardsForm({
  control,
  awardsFields,
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
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Awards
            </CardTitle>
            <CardDescription>Your awards and achievements</CardDescription>
          </div>
          <Button onClick={appendAward} size="sm">
            <Plus className="mr-2 size-4" />
            Add award
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {awardsFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">No awards added yet.</div>
        )}
        {awardsFields.map((exp, index) => (
          <div
            key={exp.id}
            className="space-y-4 p-4 border border-border rounded-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg text-gray-900">
                {watchedAwards?.[index]?.title || `Award ${index + 1}`}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAward(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
