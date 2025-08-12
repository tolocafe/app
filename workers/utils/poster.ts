import * as AWS from '@aws-sdk/client-sns'

import type { ClientData, PosterApiResponse } from '@common/api'

const snsClient = new AWS.SNS({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
	region: 'us-east-1',
})

const BASE_URL = 'https://joinposter.com/api'

export async function createPosterClient(
	token: string,
	body: Record<string, unknown>,
) {
	const data = (await fetch(`${BASE_URL}/clients.createClient?token=${token}`, {
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	}).then((response) => response.json())) as PosterApiResponse<number>

	if (typeof data.response === 'number') return data.response

	throw new Error('Failed to create client')
}

export async function createPosterOrder(
	token: string,
	orderData: Record<string, unknown>,
	clientId: string,
) {
	const finalOrderData = {
		...orderData,
		client_id: clientId,
	}

	const response = await fetch(`${BASE_URL}/orders?token=${token}`, {
		body: JSON.stringify(finalOrderData),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	})

	const data = (await response.json()) as PosterApiResponse<number>

	if (response.ok && Boolean(data.response)) {
		return data.response
	}

	throw new Error(data.error || 'Failed to create order')
}

export async function getPosterClientById(token: string, id: string) {
	const data = (await fetch(
		`${BASE_URL}/clients.getClient?token=${token}&client_id=${id}`,
	).then((response) => response.json())) as PosterApiResponse<ClientData[]>

	if (data.response.length > 0) return data.response[0]

	return null
}

export async function getPosterClientByPhone(token: string, phone: string) {
	const response = (await fetch(
		`${BASE_URL}/clients.getClients?token=${token}&phone=${encodeURIComponent(phone)}&num=1`,
	).then((response) => response.json())) as PosterApiResponse<ClientData[]>

	if (response.response.at(0)) return response.response.at(0)

	return null
}

export async function sendSms(_token: string, phone: string, message: string) {
	return snsClient.send(
		new AWS.PublishCommand({
			Message: message,
			PhoneNumber: phone,
		}),
	)
}

export async function updatePosterClient(
	token: string,
	clientId: string,
	body: Record<string, unknown>,
) {
	const data = (await fetch(`${BASE_URL}/clients.updateClient?token=${token}`, {
		body: JSON.stringify({ ...body, client_id: clientId }),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	}).then((response) => response.json())) as PosterApiResponse<number>

	if (data.response) return data.response

	throw new Error('Failed to update client')
}
