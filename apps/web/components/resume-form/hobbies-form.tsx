import { useState } from "react"
import { Plane, Plus, X } from "lucide-react"
import { Control, useFormContext, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HobbiesForm({ control }: { control: Control<any> }) {
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
          <Plane className="w-5 h-5 text-blue-600" />
          Hobbies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Add a hobby"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addHobby()
                }
              }}
            />
            <Button
              type="button"
              onClick={addHobby}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby, idx) => (
              <span
                key={idx}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {hobby}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-red-600"
                  onClick={() => removeHobby(idx)}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
