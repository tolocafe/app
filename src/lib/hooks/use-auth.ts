import { api } from '../api'
import { useMMKVString } from 'react-native-mmkv'
import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { requestOtpMutationOptions, verifyOtpMutationOptions } from '../queries/auth'

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
	const requestOtpMutation = useMutation(requestOtpMutationOptions)
	const verifyOtpMutation = useMutation({
		...verifyOtpMutationOptions,
		onSuccess: (data) => {
			setSessionStr(JSON.stringify(data))
			queryClient.invalidateQueries({ queryKey: ['self'] })
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
