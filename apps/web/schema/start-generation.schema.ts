import * as z from "zod"

export const startGenerationSchema = z.object({
  job_role: z.string().min(1, "Job Title is required"),
  job_description: z
    .string()
    .min(100, "Please provide a valid job description"),
  company: z.string().min(1, "Company is required"),
})

export type StartGenerationFormType = z.infer<typeof startGenerationSchema>
