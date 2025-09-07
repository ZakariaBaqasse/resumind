import { FileText, Plus, Trash2, User } from "lucide-react"
import { Control, useFieldArray } from "react-hook-form"

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
import { Textarea } from "../ui/textarea"

type PersonalInfoFormProps = {
  control: Control<any>
}

export default function PersonalInfoForm({ control }: PersonalInfoFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "personal_info.contact_links",
  })
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your basic contact information and details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FormField
                control={control}
                name="name"
                render={({ field: nameField }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...nameField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="email"
                render={({ field: emailField }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...emailField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="personal_info.professional_title"
                render={({ field: professionalTitleField }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input {...professionalTitleField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="personal_info.age"
                render={({ field: ageField }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...ageField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="personal_info.phone_number"
                render={({ field: phoneField }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...phoneField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="personal_info.address"
                render={({ field: addressField }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...addressField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 space-y-2">
                <FormLabel>Contact Links</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ url: "", platform: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Link
                </Button>
              </div>
              {fields.length === 0 && (
                <div className="text-sm text-gray-500 mb-2">
                  No contact links added.
                </div>
              )}
              <div className="space-y-2">
                {fields.map((item, idx) => {
                  const errors = control._formState?.errors as any
                  const platformError =
                    errors?.personal_info?.contact_links?.[idx]?.platform
                  const urlError =
                    errors?.personal_info?.contact_links?.[idx]?.url
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex gap-2 items-end">
                        {/* Platform Field */}
                        <FormField
                          control={control}
                          name={`personal_info.contact_links.${idx}.platform`}
                          render={({ field: platformField }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Platform</FormLabel>
                              <FormControl>
                                <Input
                                  {...platformField}
                                  placeholder="e.g. LinkedIn"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* URL Field */}
                        <FormField
                          control={control}
                          name={`personal_info.contact_links.${idx}.url`}
                          render={({ field: urlField }) => (
                            <FormItem className="flex-1">
                              <FormLabel>URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...urlField}
                                  placeholder="https://..."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => remove(idx)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Error messages below the row */}
                      {(platformError || urlError) && (
                        <div className="flex gap-2">
                          <div className="flex-1 min-h-[1.25rem]">
                            {platformError && (
                              <FormMessage>{platformError.message}</FormMessage>
                            )}
                          </div>
                          <div className="flex-1 min-h-[1.25rem]">
                            {urlError && (
                              <FormMessage>{urlError.message}</FormMessage>
                            )}
                          </div>
                          <div className="w-10" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Professional Summary
          </CardTitle>
          <CardDescription>
            A brief overview of your professional background and goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="personal_info.summary"
            render={({ field: summaryField }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea rows={10} {...summaryField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}
