import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  StartGenerationFormType,
  startGenerationSchema,
} from "@/schema/start-generation.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpRight, Loader2, Plus, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"

import { useStartGeneration } from "@/hooks/application/use-start-generation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function StartGenerationButton() {
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
    }
    return messages
  }, [])

  const errorMessages = getErrorMessages(errors)
  return (
    <Card
      className="flex flex-col justify-center h-fit group relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 max-w-md w-full animate-in slide-in-from-bottom-4"
      style={{ animationDelay: "100ms" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="relative pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" />
          </div>
          Start AI Generation
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Generate a complete job application package with tailored resume and
          cover letter
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Dialog open={isCreatingResume} onOpenChange={setIsCreatingResume}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200 hover:shadow-md group-hover:scale-[1.02]"
            >
              <Plus className="mr-2 size-4" />
              Generate Application
              <ArrowUpRight className="ml-2 size-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
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
