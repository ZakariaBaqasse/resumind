"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  StartGenerationFormType,
  startGenerationSchema,
} from "@/schema/start-generation.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { useStartGeneration } from "@/hooks/application/use-start-generation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Label } from "../ui/label"

export function CreateResumeCard() {
  const [isCreatingResume, setIsCreatingResume] = useState(false)
  const router = useRouter()
  const form = useForm<StartGenerationFormType>({
    resolver: zodResolver(startGenerationSchema),
    defaultValues: { company: "", job_description: "", job_role: "" },
    mode: "onChange",
  })
  const { control, reset, handleSubmit, formState } = form
  const { isValid, errors } = formState
  const { data, isMutating, error, trigger } = useStartGeneration()
  useEffect(() => {
    if (data) {
      console.log(data)
      router.push(`/applications/${data.id}/view`)
    }
  }, [data])
  const handleFormSubmit = async (formData: StartGenerationFormType) => {
    try {
      await trigger(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const getErrorMessages = useCallback((errors: any, prefix = ""): string[] => {
    if (!errors) return []
    let messages: string[] = []
    for (const key in errors) {
      if (errors[key]?.message) {
        messages.push(`${prefix}${key}: ${errors[key].message}`)
      }
      // For nested errors (arrays/objects)
      if (
        typeof errors[key] === "object" &&
        !Array.isArray(errors[key]) &&
        errors[key] !== null
      ) {
        messages = messages.concat(
          getErrorMessages(errors[key], `${prefix}${key}.`)
        )
      }
      // For arrays
      if (Array.isArray(errors[key])) {
        errors[key].forEach((item: any, idx: number) => {
          messages = messages.concat(
            getErrorMessages(item, `${prefix}${key}[${idx}].`)
          )
        })
      }
    }
    return messages
  }, [])

  const errorMessages = getErrorMessages(errors)

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors">
      <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Create Tailored Resume
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste a job description to generate a customized resume
        </p>
        <Dialog open={isCreatingResume} onOpenChange={setIsCreatingResume}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Tailored Resume</DialogTitle>
              <DialogDescription>
                Provide the job details and description to generate a customized
                resume
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-semibold text-red-700 mb-2">
                    Error while creating your tailored resume please try again
                  </div>
                </div>
              )}
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
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="job_role"
                      render={({ field: nameField }) => (
                        <FormItem>
                          <FormLabel>Job title</FormLabel>
                          <FormControl>
                            <Input {...nameField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="company"
                      render={({ field: nameField }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...nameField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Job description</Label>
                    <div className="space-y-2 mt-2">
                      <FormField
                        control={control}
                        name="job_description"
                        render={({ field: respField }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                {...respField}
                                rows={5}
                                className="flex-1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingResume(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isValid || isMutating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isMutating ? (
                        <>
                          <Loader2 /> Creating...
                        </>
                      ) : (
                        "Generate resume"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
