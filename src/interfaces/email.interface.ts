import type { z } from 'zod'
import type { emailSchema, recipientSchema } from '../helpers/schema'

export type Recipient = z.infer<typeof recipientSchema>
export type Email = z.infer<typeof emailSchema>
