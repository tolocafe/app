import { api } from '../api'
import { useMMKVString } from 'react-native-mmkv'
import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Session { token: string; client: any }
const SESSION_KEY = 'auth_session'

export function useAuth() {
	const queryClient = useQueryClient()
	const [sessionStr, setSessionStr] = useMMKVString(SESSION_KEY)
	const session = useMemo<Session | null>(() => {
		if (!sessionStr) return null
		try {
			return JSON.parse(sessionStr)
		} catch {
			return null
		}
	}, [sessionStr])
	const isAuthenticated = !!session

	// Mutations
	const requestOtpMutation = useMutation({
		mutationFn: ({ phone, name, email }: { phone: string; name?: string; email?: string }) => api.requestOtp(phone, name, email),
	})
	const verifyOtpMutation = useMutation({
		mutationFn: async ({ phone, code, sessionName }: { phone: string; code: string; sessionName: string }) => {
			const data = await api.verifyOtp(phone, code, sessionName)
			setSessionStr(JSON.stringify(data))
			queryClient.invalidateQueries({ queryKey: ['self'] })
			return data
		},
	})

	// Self query (only when authenticated)
	const selfQuery = useQuery({
		queryKey: ['self'],
		queryFn: () => api.self(session!.token),
		enabled: isAuthenticated,
	})

	const signOut = useCallback(() => {
		setSessionStr(undefined)
		queryClient.removeQueries({ queryKey: ['self'] })
	}, [setSessionStr, queryClient])

	return {
		session,
		isAuthenticated,
		requestOtpMutation,
		verifyOtpMutation,
		selfQuery,
		signOut,
	}
}
