import { z } from "zod"

/**
 * Shared between the client form (react-hook-form + zodResolver) and the
 * `/api/contact` route handler. Client-side validation is a UX nicety only —
 * the API route re-validates with this same schema since a request can
 * always bypass the browser.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  services: z.array(z.string()),
  otherService: z.string().trim().max(200).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
  turnstileToken: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
