import { useState } from "react"
import { Plus, Trash2, Volleyball } from "lucide-react"
import { Control, useFormContext, useWatch } from "react-hook-form"

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

interface HobbiesFormProps {
  control: Control<any>
}

export function HobbiesForm({ control }: HobbiesFormProps) {
  const { setValue } = useFormContext()
  const hobbies: string[] = useWatch({ control, name: "hobbies" }) || []
  const [newHobby, setNewHobby] = useState("")

  const addHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setValue("hobbies", [...hobbies, newHobby.trim()])
      setNewHobby("")
    }
  }
  const removeHobby = (idx: number) => {
    setValue(
      "hobbies",
      hobbies.filter((_, i) => i !== idx)
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volleyball className="size-5 text-primary" />
          Hobbies
        </CardTitle>
        <CardDescription>Your hobbies that you enjoy</CardDescription>
        <Button type="button" onClick={addHobby} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Hobby
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a hobby..."
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addHobby()
              }
            }}
          />
          <Button type="button" onClick={addHobby} size="sm">
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby, index) => (
            <Badge
              key={hobby}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeHobby(index)}
            >
              {hobby}
              <Trash2 className="ml-1 size-3" />
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
