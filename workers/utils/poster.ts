const BASE_URL = 'https://joinposter.com/api'

export async function createPosterClient(token: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/clients.createClient?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json?.response?.client) return json.response.client
  throw new Error('Failed to create client')
}

export async function getPosterClientByPhone(token: string, phone: string) {
  const res = await fetch(`${BASE_URL}/clients.getClients?token=${token}&phone=${encodeURIComponent(phone)}`)
  const json = await res.json()
  if (json?.response?.clients?.length) return json.response.clients[0]
  return null
}

export async function getPosterClientById(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/clients.getClients?token=${token}&client_id=${id}`)
  const json = await res.json()
  if (json?.response?.clients?.length) return json.response.clients[0]
  return null
}

export async function updatePosterClient(token: string, id: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/clients.updateClient?token=${token}&client_id=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return (await res.json())?.response?.client
}

export async function sendSms(token: string, phone: string, text: string) {
  const res = await fetch(`${BASE_URL}/clients.sendSms?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, text }),
  })
  const json = await res.json()
  if (json?.response?.sms_id) return json.response
  throw new Error('Failed to send SMS')
}