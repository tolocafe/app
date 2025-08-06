import { SignJWT, jwtVerify } from 'jose'

const encoder = new TextEncoder()
const secretKey = (secret: string) => encoder.encode(secret)

export async function signJwt(clientId: string, secret: string): Promise<string> {
  return new SignJWT({ sub: clientId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .sign(secretKey(secret))
}

export async function verifyJwt(token: string, secret: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(secret))
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

export function extractToken(authorizationHeader?: string | null): string | null {
  if (!authorizationHeader) return null;
  return authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : null;
}

export async function authenticate(authorizationHeader: string | null | undefined, secret: string): Promise<string | null> {
  const token = extractToken(authorizationHeader)
  if (!token) return null
  return verifyJwt(token, secret)
}