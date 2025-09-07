import { useState } from "react"
import { format } from "date-fns"
import { Award, CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Control, FieldArrayWithId, useWatch } from "react-hook-form"

import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

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
  const [newCertification, setNewCertification] = useState("")
  const [issuer, setIssuer] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined)
  const [error, setError] = useState("")
  const handleAppendCertification = () => {
    if (newCertification.trim() === "" || issuer.trim() === "" || !issueDate) {
      control.setError("certifications", {
        type: "onBlur",
        message: "Please add a certification, issuer and issue date",
      })
      setError("All fields are required")
      return
    }
    setError("")

    appendCertification({
      name: newCertification,
      issuer,
      issue_date: issueDate.toLocaleDateString(),
    })
    setIssueDate(undefined)
    setIssuer("")
    setNewCertification("")
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="size-5 text-primary" />
          Certifications
        </CardTitle>
        <CardDescription>
          Your professional certifications and credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a certification..."
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAppendCertification()
              }
            }}
          />
          <Input
            placeholder="Issuer e.g. Google, Coursera, ..."
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAppendCertification()
              }
            }}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!issueDate}
                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon />
                {issueDate ? (
                  format(issueDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                required
                mode="single"
                selected={issueDate}
                onSelect={setIssueDate}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            onClick={() => handleAppendCertification()}
            size="sm"
          >
            <Plus className="size-4" />
          </Button>
          {error && (
            <div className="text-destructive text-sm my-2">{error}</div>
          )}
        </div>
        <div className="space-y-2">
          {certificationFields.map((cert, index) => (
            <div
              key={`${cert["name"]}-${index}`}
              className="flex items-center justify-between p-2 border border-border rounded-md"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{cert["name"]}</span>
                <span className="text-xs text-muted-foreground">
                  {cert["issuer"]}
                  {cert["issue_date"] && (
                    <>
                      {" · "}
                      {cert["issue_date"]}
                    </>
                  )}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
