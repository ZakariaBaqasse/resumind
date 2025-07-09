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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificationFields.length === 0 && (
          <div className="text-sm text-gray-500 mb-2">
            No certifications added yet.
          </div>
        )}
        {certificationFields.map((field, index) => (
          <div key={field.id} className="space-y-4">
            {index > 0 && <Separator />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`certifications.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY-MM-DD" />
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
              onClick={() => removeCertification(index)}
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
            appendCertification({
              name: "",
              issuer: "",
              issue_date: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" /> Add Certification
        </Button>
      </CardContent>
    </Card>
  )
}
