import { z } from 'zod/v4'

export const PhoneSchema = z
	.string()
	.trim()
	.transform((s) => (s.startsWith('+') ? s : `+${s}`))
	.refine((value) => /^\+\d{7,15}$/.test(value), {
		message: 'Invalid phone number format',
	})

export type Phone = z.infer<typeof PhoneSchema>

export const RequestOtpSchema = z.object({
	email: z.email('errors.invalid-email').optional(),
	name: z.string().min(1, 'errors.required').optional(),
	phone: PhoneSchema,
})

export type RequestOtp = z.infer<typeof RequestOtpSchema>

export const VerifyOtpSchema = z.object({
	code: z.string().length(6, 'errors.max-length'),
	phone: PhoneSchema,
	sessionName: z.string().min(1),
})

export type VerifyOtp = z.infer<typeof VerifyOtpSchema>

export const CreateOrderProductSchema = z.object({
	comment: z.string().max(2000, 'errors.max-length').optional(),
	count: z.number().int().positive().max(10, 'errors.max-count').default(1),
	id: z.string().min(1, 'errors.required'),
	modification: z
		.array(
			z.object({
				count: z
					.number()
					.int()
					.positive()
					.max(10, 'errors.max-count')
					.default(1),
				id: z.string().min(1, 'errors.required'),
			}),
		)
		.optional(),
})

export const CreateOrderSchema = z.object({
	client: z.object({
		id: z.string().min(1, 'errors.required'),
	}),
	comment: z.string().max(2000, 'errors.max-length').optional(),
	products: z.array(CreateOrderProductSchema).min(1, 'errors.min-count'),
	serviceMode: z.number().int().positive().max(3, 'errors.invalid').default(1),
})

export type CreateOrder = z.infer<typeof CreateOrderSchema>
