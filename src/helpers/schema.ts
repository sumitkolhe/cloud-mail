import { z } from 'zod'

export const recipientSchema = z.union([
  z.string().email(),
  z.object({
    email: z.string().email(),
    name: z.optional(z.string()),
  }),
])

export const recipientsSchema = z.union([
  recipientSchema,
  z.array(recipientSchema),
  z.undefined(),
])

export const emailSchema = z.object({
  to: recipientsSchema,
  cc: recipientsSchema,
  bcc: recipientsSchema,
  replyTo: recipientsSchema,
  from: recipientSchema,
  subject: z.string(),
  text: z.optional(z.string()),
  html: z.optional(z.string()),
})
