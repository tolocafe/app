import { convertOrderToApiFormat } from '@/lib/queries/order'

import type { Order } from '@/lib/stores/order-store'

// Mock the API service to avoid importing ky and other dependencies
jest.mock('@/lib/services/api-service', () => ({
	api: {
		orders: {
			create: jest.fn(),
		},
	},
}))

describe('order utilities', () => {
	describe('convertOrderToApiFormat', () => {
		it('converts basic order to API format', () => {
			const order: Order = {
				createdAt: new Date('2023-01-01'),
				id: 'test-order-1',
				items: [
					{
						productId: 'prod-123',
						quantity: 2,
					},
					{
						productId: 'prod-456',
						quantity: 1,
					},
				],
				status: 'draft',
				totalAmount: 15.99,
				updatedAt: new Date('2023-01-01'),
			}

			const result = convertOrderToApiFormat(order)

			expect(result).toEqual({
				comment: undefined,
				payment: {
					sum: 0,
					type: 'cash',
				},
				products: [
					{
						count: 2,
						modifications: undefined,
						product_id: 'prod-123',
					},
					{
						count: 1,
						modifications: undefined,
						product_id: 'prod-456',
					},
				],
				service_mode: '2',
			})
		})

		it('converts order with customer note to API format', () => {
			const order: Order = {
				createdAt: new Date('2023-01-01'),
				customerNote: 'Extra hot, no foam',
				id: 'test-order-2',
				items: [
					{
						productId: 'prod-789',
						quantity: 1,
					},
				],
				status: 'draft',
				totalAmount: 8.5,
				updatedAt: new Date('2023-01-01'),
			}

			const result = convertOrderToApiFormat(order)

			expect(result.comment).toBe('Extra hot, no foam')
		})

		it('converts order with modifications to API format', () => {
			const order: Order = {
				createdAt: new Date('2023-01-01'),
				id: 'test-order-3',
				items: [
					{
						modifications: [
							{
								id: 'mod-extra-shot',
								name: 'Extra Shot',
								price: 0.75,
							},
							{
								id: 'mod-oat-milk',
								name: 'Oat Milk',
								price: 0.5,
							},
						],
						productId: 'prod-coffee',
						quantity: 1,
					},
				],
				status: 'draft',
				totalAmount: 6.25,
				updatedAt: new Date('2023-01-01'),
			}

			const result = convertOrderToApiFormat(order)

			expect(result.products[0].modifications).toEqual([
				{
					count: 1,
					modification_id: 'mod-extra-shot',
				},
				{
					count: 1,
					modification_id: 'mod-oat-milk',
				},
			])
		})

		it('handles empty order items', () => {
			const order: Order = {
				createdAt: new Date('2023-01-01'),
				id: 'empty-order',
				items: [],
				status: 'draft',
				totalAmount: 0,
				updatedAt: new Date('2023-01-01'),
			}

			const result = convertOrderToApiFormat(order)

			expect(result.products).toEqual([])
		})

		it('sets default values correctly', () => {
			const order: Order = {
				createdAt: new Date('2023-01-01'),
				id: 'test-defaults',
				items: [
					{
						productId: 'prod-test',
						quantity: 1,
					},
				],
				status: 'draft',
				totalAmount: 5,
				updatedAt: new Date('2023-01-01'),
			}

			const result = convertOrderToApiFormat(order)

			expect(result.service_mode).toBe('2') // takeaway
			expect(result.payment.type).toBe('cash')
			expect(result.payment.sum).toBe(0) // server calculates
		})
	})
})
