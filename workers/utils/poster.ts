import { ClientData, PosterApiResponse } from '@/lib/api'
import { extractToken, verifyJwt } from './jwt'

const BASE_URL = 'https://joinposter.com/api'

export async function createPosterClient(
	token: string,
	body: Record<string, unknown>,
) {
	const res = await fetch(`${BASE_URL}/clients.createClient?token=${token}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	const json = await res.json()

	if (res.ok) return json.response.client

	throw new Error('Failed to create client')
}

export async function getPosterClientByPhone(token: string, phone: string) {
	const res = (await fetch(
		`${BASE_URL}/clients.getClients?token=${token}&phone=${encodeURIComponent(phone)}`,
	).then((res) => res.json())) as PosterApiResponse<ClientData[]>

	if (res?.response?.length) return res.response[0]

	return null
}

export async function getPosterClientById(token: string, id: string) {
	const res = (await fetch(
		`${BASE_URL}/clients.getClient?token=${token}&client_id=${id}`,
	).then((res) => res.json())) as PosterApiResponse<ClientData[]>

	if (res?.response?.length) return res.response[0]

	return null
}

export async function updatePosterClient(
	token: string,
	id: string,
	body: Record<string, unknown>,
) {
	const res = (await fetch(
		`${BASE_URL}/clients.updateClient?token=${token}&client_id=${id}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		},
	).then((res) => res.json())) as PosterApiResponse<number>

	if (res?.response) return res.response

	throw new Error('Failed to update client')
}

export async function sendSms(token: string, phone: string, text: string) {
	const res = (await fetch(`${BASE_URL}/clients.sendSms?token=${token}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone, text }),
	}).then((res) => res.json())) as PosterApiResponse<true>

	if (res?.response) {
		return res.response
	}

	throw new Error('Failed to send SMS')
}

export async function createPosterOrder(
	token: string,
	orderData: Record<string, unknown>,
	bearerToken: string,
	jwtSecret: string,
) {
	// Extract customer ID from Bearer token - this is required
	const jwt = extractToken(bearerToken)
	if (!jwt) {
		throw new Error('Invalid Bearer token format')
	}

	const customerId = await verifyJwt(jwt, jwtSecret)
	if (!customerId) {
		throw new Error('Invalid or expired Bearer token')
	}

	// Add customer ID to order data
	const finalOrderData = {
		...orderData,
		client_id: customerId,
	}

	const res = await fetch(
		`${BASE_URL}/transactions.createOrder?token=${token}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(finalOrderData),
		},
	)

	const json = await res.json()

	if (res.ok && json.response) {
		return json.response
	}

	throw new Error(json.error || 'Failed to create order')
}
