export interface MenuItem {
	id: string
	name: string
	description: string
	category: 'coffee' | 'tea' | 'pastries' | 'sandwiches' | 'seasonal'
	price: number
	image?: string
	isPopular?: boolean
	isNew?: boolean
}

export interface Category {
	id: string
	name: string
}
