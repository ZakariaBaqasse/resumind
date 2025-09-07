import { useCallback, useState } from "react"
import {
  editCoverLetterSchema,
  EditCoverLetterSchema,
} from "@/schema/edit-cover-letter.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { CheckCircle, Download, Edit2, Eye } from "lucide-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"

import { Resume } from "@/types/resume.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import CoverLetterPDF from "./cover-letter-pdf"

type CoverLetterEditFormProps = {
  coverLetterContent: string
  generatedResume: Resume
  company: string
  jobTitle: string
  onSubmit: (data: EditCoverLetterSchema) => Promise<void>
  isSubmitting?: boolean
  submitError: any
  saveSuccess?: boolean
}

export default function CoverLetterEditForm({
  coverLetterContent,
  generatedResume,
  company,
  jobTitle,
  onSubmit,
  isSubmitting,
  submitError,
  saveSuccess,
}: CoverLetterEditFormProps) {
  const [editMode, setEditMode] = useState(false)
  const form = useForm<EditCoverLetterSchema>({
    resolver: zodResolver(editCoverLetterSchema),
    defaultValues: { cover_letter_content: coverLetterContent ?? "" },
    mode: "onChange",
  })
  const { control, handleSubmit, formState } = form
  const { isValid, errors } = formState

  const watchedCoverLetter = useWatch({
    control,
    name: "cover_letter_content",
  })

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

  if (editMode) {
    return (
      <div className="space-y-6 animate-in fade-in-50 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Cover Letter Editor
            </h1>
            <p className="text-muted-foreground">
              Edit your generated cover letter
            </p>
          </div>
          <Button variant="outline" onClick={() => setEditMode(false)}>
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
        </div>

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
            <div className="flex justify-end pt-4">
              <Button
                disabled={isSubmitting || !isValid || saveSuccess}
                type="submit"
                className={`px-8 py-2 rounded text-white text-lg font-semibold transition-colors duration-500
                ${
                  saveSuccess ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                }
                ${
                  isSubmitting || !isValid
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }
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
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Cover Letter Preview
          </h1>
          <p className="text-muted-foreground">
            Preview your generated cover letter
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditMode(true)}>
            <Edit2 className="mr-2 size-4" />
            Edit
          </Button>
          <PDFDownloadLink
            document={
              <CoverLetterPDF
                coverLetter={watchedCoverLetter}
                company={company}
                generatedResume={generatedResume}
                jobTitle={jobTitle}
              />
            }
            fileName="Cover_Letter.pdf"
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="mr-2 size-4" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
      <Card>
        <CardContent className="p-8">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 bg-white p-6 rounded-lg shadow-sm">
            {watchedCoverLetter}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
