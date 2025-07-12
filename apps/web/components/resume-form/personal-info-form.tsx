import { Plus, Trash2, User, X } from "lucide-react"
import { Control, useFieldArray } from "react-hook-form"

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
import { Textarea } from "@/components/ui/textarea"

type PersonalInfoFormProps = {
  control: Control<any>
}

export function PersonalInfoForm({ control }: PersonalInfoFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "personal_info.contact_links",
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <FormField
          control={control}
          name="personal_info.summary"
          render={({ field: summaryField }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <FormControl>
                <Textarea rows={3} {...summaryField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Contact Links */}
        <div>
          <div className="flex items-center gap-2 mb-2">
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
              const urlError = errors?.personal_info?.contact_links?.[idx]?.url
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
                            <Input {...urlField} placeholder="https://..." />
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
      </CardContent>
    </Card>
  )
}
