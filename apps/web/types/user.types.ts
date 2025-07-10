import { Resume } from "./resume.types"

export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  initial_resume: { resume: Resume }
}

export type Session = {
  user: User
  expires: string
}
