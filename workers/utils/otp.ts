export function generateOtp(length = 6): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((v) => (v % 10).toString())
    .join('')
}

export async function storeOtp(kv: KVNamespace, phone: string, code: string, ttl = 300) {
  await kv.put(`otp:${phone}`, code, { expirationTtl: ttl })
}

export async function verifyOtp(kv: KVNamespace, phone: string, code: string): Promise<boolean> {
  const stored = await kv.get(`otp:${phone}`)
  return stored === code
}