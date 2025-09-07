import { useState } from "react"
import { Code, Languages, Plus, Trash2 } from "lucide-react"
import { Control, FieldArrayWithId } from "react-hook-form"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface LanguagesFormProps {
  control: Control<any>
  languagesFields: FieldArrayWithId<any, any, any>[]
  appendLanguage: (value: any) => void
  removeLanguage: (index: number) => void
}

export function LanguagesForm({
  control,
  languagesFields,
  appendLanguage,
  removeLanguage,
}: LanguagesFormProps) {
  const [newLanguage, setNewLanguage] = useState("")
  const [proficiency, setProficiency] = useState("")
  const [error, setError] = useState("")
  const handleAppendLanguage = () => {
    if (newLanguage.trim() === "" || proficiency.trim() === "") {
      control.setError("languages", {
        type: "onBlur",
        message: "Please add a language and a proficiency level",
      })
      setError("Please add a language and a proficiency level")
      return
    }
    setError("")
    appendLanguage({
      name: newLanguage,
      proficiency: proficiency,
    })
    setNewLanguage("")
    setProficiency("")
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="size-5 text-primary" />
          Languages
        </CardTitle>
        <CardDescription>The languages you master</CardDescription>
        <Button
          onClick={handleAppendLanguage}
          type="button"
          size="sm"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add language
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a language..."
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAppendLanguage()
              }
            }}
          />
          <Select value={proficiency} onValueChange={setProficiency}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Proficiency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAppendLanguage} size="sm">
            <Plus className="size-4" />
          </Button>
          {error && (
            <div className="text-destructive text-sm my-2">{error}</div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {languagesFields.map((language, index) => {
            const languageProficiency =
              language["proficiency"] !== undefined &&
              language["proficiency"].toLowerCase() !== "not provided"
                ? language["proficiency"]
                : "Conversational"
            return (
              <Badge
                key={`${language["name"]}-${index}`}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeLanguage(index)}
              >
                {language["name"]}({languageProficiency})
                <Trash2 className="ml-1 size-3" />
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
