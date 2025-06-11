export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

export type Session = {
  user: User
  expires: string
}
