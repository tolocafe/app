import { z } from 'zod/v4'

export const phoneSchema = z
	.string()
	.trim()
	.transform((s) => (s.startsWith('+') ? s : `+${s}`))
	.refine((value) => /^\+\d{7,15}$/.test(value), {
		message: 'Invalid phone number format',
	})

export const requestOtpSchema = z.object({
	email: z.email().optional(),
	name: z.string().min(1).optional(),
	phone: phoneSchema,
})

export const verifyOtpSchema = z.object({
	code: z.string().length(6),
	phone: phoneSchema,
	sessionName: z.string().min(1),
})

export const orderItemSchema = z.object({
	count: z.number().int().positive(),
	modifications: z
		.array(
			z.object({
				count: z.number().int().positive().default(1),
				modification_id: z.string(),
			}),
		)
		.optional(),
	price: z.number().positive().optional(),
	product_id: z.string().min(1),
})

export const createOrderSchema = z.object({
	client_address: z.string().optional(),
	client_id: z.string().min(1),
	client_name: z.string().optional(),
	comment: z.string().optional(),
	payment: z.object({
		sum: z.number().positive(),
		type: z.enum(['cash', 'card', 'online']).default('cash'),
	}),
	phone: phoneSchema.optional(),
	products: z.array(orderItemSchema).min(1),
	service_mode: z.enum(['1', '2', '3']).default('1'), // 1 = table service, 2 = takeaway, 3 = delivery
	spot_id: z.number().int().positive().default(1),
})
