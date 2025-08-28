import * as z from "zod"

export const editCoverLetterSchema = z.object({
  cover_letter_content: z
    .string()
    .min(500, "Please provide a valid cover letter content"),
})

export type EditCoverLetterSchema = z.infer<typeof editCoverLetterSchema>
