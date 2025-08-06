import { HTTPException } from 'hono/http-exception'

export function generateOtp(length = 6): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((v) => (v % 10).toString())
    .join('')
}

export async function storeOtp(kv: KVNamespace, phone: string, code: string, ttl = 300) {
  await kv.put(phone, code, { expirationTtl: ttl })
}

export async function verifyOtp(kv: KVNamespace, phone: string, code: string): Promise<void> {
  const stored = await kv.get(phone)
  if (!stored || stored !== code) throw new HTTPException(401, { message: 'Invalid or expired code' })
}