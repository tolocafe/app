export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://tolo-app.pages.dev/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? res.statusText)
  return json as T
}

export const api = {
  requestOtp: (phone: string, name?: string, email?: string) =>
    request<{ success: true }>(`/auth/request-otp`, {
      method: 'POST',
      body: JSON.stringify({ phone, name, email }),
    }),

  verifyOtp: (phone: string, code: string, sessionName: string) =>
    request<{ token: string; client: any }>(`/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ phone, code, sessionName }),
    }),

  self: (token: string) =>
    request<any>(`/auth/self`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
}