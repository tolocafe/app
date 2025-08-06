import { z } from 'zod'

export const phoneSchema = z
  .string()
  .trim()
  .transform((s) => (s.startsWith('+') ? s : `+${s}`))
  .refine((val) => /^\+[0-9]{7,15}$/.test(val), {
    message: 'Invalid phone number format',
  })

export const requestOtpSchema = z.object({
  phone: phoneSchema,
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6),
})