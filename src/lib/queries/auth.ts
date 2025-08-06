import { mutationOptions } from '@tanstack/react-query'
import { api } from '../api'

export const requestOtpMutationOptions = mutationOptions({
  mutationFn: ({ phone, name, email }: { phone: string; name?: string; email?: string }) => api.requestOtp(phone, name, email),
})

export const verifyOtpMutationOptions = mutationOptions({
  mutationFn: ({ phone, code, sessionName }: { phone: string; code: string; sessionName: string }) => api.verifyOtp(phone, code, sessionName),
})