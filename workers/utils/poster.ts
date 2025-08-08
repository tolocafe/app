import { ClientData, PosterApiResponse } from '@/lib/api'
// import { AwsClient } from 'aws4fetch'

// const aws = new AwsClient({
// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// })

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
		`${BASE_URL}/clients.getClients?token=${token}&phone=${encodeURIComponent(phone)}&num=1`,
	).then((res) => res.json())) as PosterApiResponse<ClientData[]>

	if (res?.response?.at(0)) return res.response.at(0)

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
	clientId: string,
	body: Record<string, unknown>,
) {
	const res = (await fetch(`${BASE_URL}/clients.updateClient?token=${token}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...body, client_id: clientId }),
	}).then((res) => res.json())) as PosterApiResponse<number>

	if (res?.response) return res.response

	throw new Error('Failed to update client')
}

export async function sendSms(token: string, phone: string, message: string) {
	// TODO: use real service

	/**
	 * https://sns.us-west-2.amazonaws.com/?Action=Publish
&TargetArn=arn%3Aaws%3Asns%3Aus-west-2%3A803981987763%3Aendpoint%2FAPNS_SANDBOX%2Fpushapp%2F98e9ced9-f136-3893-9d60-776547eafebb
&Message=%7B%22default%22%3A%22This+is+the+default+Message%22%2C%22APNS_SANDBOX%22%3A%22%7B+%5C%22aps%5C%22+%3A+%7B+%5C%22alert%5C%22+%3A+%5C%22You+have+got+email.%5C%22%2C+%5C%22badge%5C%22+%3A+9%2C%5C%22sound%5C%22+%3A%5C%22default%5C%22%7D%7D%22%7D
&Version=2010-03-31
&AUTHPARAMS
	 */

	console.log({ token, phone, message })

	// await aws.fetch(`https://sns.us-west-2.amazonaws.com/?Action=Publish`, {
	// 	body: JSON.stringify({
	// 		TargetArn:
	// 			'arn:aws:sns:us-west-2:803981987763:endpoint/APNS_SANDBOX/pushapp/98e9ced9-f136-3893-9d60-776547eafebb',
	// 		Message: JSON.stringify({
	// 			Message: 'Hello',
	// 		}),
	// 	}),
	// })

	return true
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
