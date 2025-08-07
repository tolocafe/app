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
	email: z.email().optional(),
})

export const verifyOtpSchema = z.object({
	phone: phoneSchema,
	code: z.string().length(6),
	sessionName: z.string().min(1),
})

export const orderItemSchema = z.object({
	product_id: z.string().min(1),
	count: z.number().int().positive(),
	price: z.number().positive().optional(),
	modifications: z
		.array(
			z.object({
				modification_id: z.string(),
				count: z.number().int().positive().default(1),
			}),
		)
		.optional(),
})

export const createOrderSchema = z.object({
	client_id: z.string().min(1),
	spot_id: z.number().int().positive().default(1),
	products: z.array(orderItemSchema).min(1),
	comment: z.string().optional(),
	phone: phoneSchema.optional(),
	client_name: z.string().optional(),
	client_address: z.string().optional(),
	service_mode: z.enum(['1', '2', '3']).default('1'), // 1 = table service, 2 = takeaway, 3 = delivery
	payment: z.object({
		type: z.enum(['cash', 'card', 'online']).default('cash'),
		sum: z.number().positive(),
	}),
})
