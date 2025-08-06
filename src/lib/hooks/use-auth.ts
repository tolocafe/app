import { useMMKVString } from 'react-native-mmkv'
import { useCallback, useMemo } from 'react'

export interface AuthUser {
	id: string
	email: string | null
	fullName: string | null
	identityToken?: string
	authorizationCode?: string
}

const AUTH_USER_KEY = 'auth_user'

export function useAuth() {
	const [userString, setUserString] = useMMKVString(AUTH_USER_KEY)

	const user = useMemo<AuthUser | null>(() => {
		if (!userString) return null
		try {
			return JSON.parse(userString)
		} catch {
			return null
		}
	}, [userString])

	const isAuthenticated = useMemo(() => !!user, [user])

	const signIn = useCallback(
		(authUser: AuthUser) => {
			setUserString(JSON.stringify(authUser))
		},
		[setUserString],
	)

	const signOut = useCallback(() => {
		setUserString(undefined)
	}, [setUserString])

	return {
		user,
		isAuthenticated,
		signIn,
		signOut,
	}
}
