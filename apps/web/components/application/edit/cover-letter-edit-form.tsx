import { useCallback } from "react"
import {
  editCoverLetterSchema,
  EditCoverLetterSchema,
} from "@/schema/edit-cover-letter.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle } from "lucide-react"
import { Form, FormProvider, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

type CoverLetterEditFormProps = {
  coverLetterContent: string
  onSubmit: (data: EditCoverLetterSchema) => Promise<void>
  isSubmitting?: boolean
  submitError: any
  saveSuccess?: boolean
}

export default function CoverLetterEditForm({
  coverLetterContent,
  onSubmit,
  isSubmitting,
  submitError,
  saveSuccess,
}: CoverLetterEditFormProps) {
  const form = useForm<EditCoverLetterSchema>({
    resolver: zodResolver(editCoverLetterSchema),
    defaultValues: { cover_letter_content: coverLetterContent ?? "" },
    mode: "onChange",
  })
  const { control, reset, handleSubmit, formState } = form
  const { isValid, errors } = formState

  // Helper to recursively extract error messages
  const getErrorMessages = useCallback((errors: any, prefix = ""): string[] => {
    if (!errors) return []
    let messages: string[] = []
    for (const key in errors) {
      if (errors[key]?.message) {
        messages.push(`${prefix}${key}: ${errors[key].message}`)
      }
    }
    return messages
  }, [])

  const errorMessages = getErrorMessages(errors)

  const handleFormSubmit = async (data: EditCoverLetterSchema) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {errorMessages.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-semibold text-red-700 mb-2">
              Please fix the following errors:
            </div>
            <ul className="list-disc list-inside text-red-600 text-sm">
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="font-semibold text-red-700 mb-2">
                  Error while saving your changes please try again
                </div>
              </div>
            )}
            <FormField
              control={control}
              name="cover_letter_content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={20}
                      className="flex-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button and Success Message */}
            <div className="flex flex-col items-center pt-6">
              <Button
                disabled={isSubmitting || !isValid || saveSuccess}
                type="submit"
                className={`px-8 py-2 rounded text-white text-lg font-semibold transition-colors duration-500
                ${saveSuccess ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
                ${isSubmitting || !isValid ? "opacity-60 cursor-not-allowed" : ""}
              `}
              >
                {saveSuccess ? (
                  <span className="flex items-center gap-2 transition-opacity duration-500">
                    <CheckCircle className="w-5 h-5" />
                    Saved!
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
              {coverLetterContent}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
