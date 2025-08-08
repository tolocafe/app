import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/services/api-service'
import type { ClientData } from '@/lib/api'

type RequestOtpMutationOptions = {
	phone: string
	name?: string
	email?: string
}

export const requestOtpMutationOptions = mutationOptions({
	mutationFn: ({ phone, name, email }: RequestOtpMutationOptions) => {
		return api.auth.requestOtp(phone, name, email)
	},
})

type VerifyOtpMutationOptions = {
	phone: string
	code: string
	sessionName: string
}

export const verifyOtpMutationOptions = mutationOptions({
	mutationFn: ({ phone, code, sessionName }: VerifyOtpMutationOptions) => {
		return api.auth.verifyOtp(phone, code, sessionName)
	},
})

export const selfQueryOptions = queryOptions({
	queryKey: ['self'],
	queryFn: () => api.auth.self(),
})

export const updateClientMutationOptions = (clientId: string) =>
	mutationOptions<ClientData, Error, Record<string, unknown>>({
		mutationFn: (data) => api.client.update(clientId, data),
	})
