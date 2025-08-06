import { api } from '../api'
import { useMMKVString } from 'react-native-mmkv'
import { useCallback, useMemo } from 'react'

interface Session { token: string; client: any }
const SESSION_KEY = 'auth_session'

export function useAuth() {
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

	const requestOtp = useCallback((phone: string, name?: string, email?: string) => api.requestOtp(phone, name, email), [])
	const signIn = useCallback(async (phone: string, code: string, sessionName: string) => {
		const data = await api.verifyOtp(phone, code, sessionName)
		setSessionStr(JSON.stringify(data))
	}, [setSessionStr])
	const signOut = useCallback(() => setSessionStr(undefined), [setSessionStr])
	const refreshSelf = useCallback(async () => {
		if (!session) return null
		const client = await api.self(session.token)
		const updated: Session = { ...session, client }
		setSessionStr(JSON.stringify(updated))
		return client
	}, [session, setSessionStr])
	return { session, isAuthenticated, requestOtp, signIn, signOut, refreshSelf }
}
