import { SignJWT, jwtVerify } from 'jose'
import { HTTPException } from 'hono/http-exception'
import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'

const encoder = new TextEncoder()
const secretKey = (secret: string) => encoder.encode(secret)

export async function signJwt(
	clientId: string,
	secret: string,
): Promise<string> {
	return new SignJWT({ sub: clientId })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.sign(secretKey(secret))
}

export async function verifyJwt(
	token: string,
	secret: string,
): Promise<string | null> {
	try {
		const { payload } = await jwtVerify(token, secretKey(secret))
		return typeof payload.sub === 'string' ? payload.sub : null
	} catch {
		return null
	}
}

export function extractToken(
	authorizationHeader?: string | null,
): string | null {
	if (!authorizationHeader) return null
	return authorizationHeader.startsWith('Bearer ')
		? authorizationHeader.slice(7)
		: null
}

export async function authenticate(
	c: Context,
	secret: string,
): Promise<string> {
	const authorizationHeader = c.req.header('Authorization')
	const token =
		extractToken(authorizationHeader) ?? getCookie(c, 'tolo_session') ?? null
	if (!token) throw new HTTPException(401, { message: 'Unauthorized' })

	const clientId = await verifyJwt(token, secret)
	if (!clientId) throw new HTTPException(401, { message: 'Unauthorized' })

	return clientId
}
