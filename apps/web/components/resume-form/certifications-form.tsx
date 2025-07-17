import { Award, Plus, Trash2 } from "lucide-react"
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

interface CertificationsFormProps {
  control: Control<any>
  certificationFields: FieldArrayWithId<any, any, any>[]
  appendCertification: (value: any) => void
  removeCertification: (index: number) => void
}

export function CertificationsForm({
  control,
  certificationFields,
  appendCertification,
  removeCertification,
}: CertificationsFormProps) {
  const watchedCertifications = useWatch({
    control,
    name: "certifications",
  })
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Certifications
          </CardTitle>
          <Button onClick={appendCertification} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {certificationFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">
            No certifications added yet.
          </div>
        )}
        {certificationFields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg text-gray-900">
                {watchedCertifications?.[index]?.name ||
                  `Certification ${index + 1}`}
              </h2>
              <Button
                onClick={() => removeCertification(index)}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`certifications.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`certifications.${index}.issuer`}
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
                name={`certifications.${index}.issue_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date (YYYY-MM)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="2023-06" />
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
