import { useState } from "react"
import { Code, Plus, Trash2 } from "lucide-react"
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

interface SkillsFormProps {
  control: Control<any>
  skillFields: FieldArrayWithId<any, any, any>[]
  appendSkill: (value: any) => void
  removeSkill: (index: number) => void
}

export function SkillsForm({
  control,
  skillFields,
  appendSkill,
  removeSkill,
}: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newSkillProficiency, setNewSkillProficiency] = useState("")
  const [error, setError] = useState("")
  const handleAppendSkill = () => {
    if (newSkill.trim() === "" || newSkillProficiency.trim() === "") {
      control.setError("skills", {
        type: "onBlur",
        message: "Please add a skill and a proficiency level",
      })
      setError("Please add a skill and a proficiency level")
      return
    }
    setError("")
    appendSkill({
      name: newSkill,
      proficiency_level: newSkillProficiency,
    })
    setNewSkill("")
    setNewSkillProficiency("")
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="size-5 text-primary" />
          Skills
        </CardTitle>
        <CardDescription>
          Your technical and professional skills
        </CardDescription>
        <Button onClick={appendSkill} type="button" size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAppendSkill()
              }
            }}
          />
          <Select
            value={newSkillProficiency}
            onValueChange={setNewSkillProficiency}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Proficiency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAppendSkill} type="button" size="sm">
            <Plus className="size-4" />
          </Button>
        </div>
        {error && <div className="text-destructive text-sm my-2">{error}</div>}
        <div className="flex flex-wrap gap-2">
          {skillFields.map((skill, index) => {
            const skillProficiency =
              skill["proficiency_level"] !== undefined &&
              skill["proficiency_level"].toLowerCase() !== "not provided"
                ? skill["proficiency_level"]
                : "Beginner"
            return (
              <Badge
                key={`${skill["name"]}-${skillProficiency}-${index}`}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeSkill(index)}
              >
                {skill["name"]}({skillProficiency})
                <Trash2 className="ml-1 size-3" />
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
