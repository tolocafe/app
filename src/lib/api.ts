export const BASE_URL = process.env.EXPO_PUBLIC_API_URL
export const POSTER_BASE_URL = process.env.EXPO_PUBLIC_POSTER_API_URL

export type ClientAddress = {
	address1: string
	address2: string
	city: string
	comment: string
	country: string
	delivery_zone_id: number
	id: number
	lat: string
	lng: string
	sort_order: number
	zip_code: string
}

export type ClientData = {
	address?: string
	addresses?: ClientAddress[]
	birthday?: string
	birthday_bonus?: string
	bonus?: string
	card_number?: string
	city?: string
	client_groups_discount?: string
	client_groups_id?: string
	client_groups_name?: string
	client_id: string
	client_sex?: string
	comment?: string
	country?: string
	date_activale?: string
	// Additional Poster client fields returned by API (kept optional)
	discount_per?: string
	email?: string
	/** String in cents, e.g. "500" -> $5.00 */
	ewallet?: string
	/** Poster fields for granular name support */
	firstname: string
	government_id?: null | string
	lastname: string
	loyalty_type?: string
	/** Optional combined name if available */
	name?: string
	patronymic?: string
	phone: string
	/** E.g. 527224067201 */
	phone_number?: string
	total_payed_sum?: string
}

export type PosterApiResponse<T> = {
	error?: string
	response: T
}

export type PosterCategory = {
	category_color: string
	category_hidden: string
	category_id: string
	category_name: string
	category_photo: null | string
	category_photo_origin: null | string
	category_tag: null | string
	fiscal: string
	left: string
	level: string
	nodiscount: string
	parent_category: string
	right: string
	sort_order: string
	tax_id: string
	visible: {
		spot_id: number
		visible: number
	}[]
}

export type PosterIngredient = {
	ingredient_id: string
	ingredient_name: string
	ingredient_unit: string
	ingredient_weight: number
	ingredients_losses_bake: string
	ingredients_losses_clear: string
	ingredients_losses_cook: string
	ingredients_losses_fry: string
	ingredients_losses_stew: string
	pr_in_bake: string
	pr_in_clear: string
	pr_in_cook: string
	pr_in_fry: string
	pr_in_stew: string
	structure_brutto: number
	structure_id: string
	structure_lock: string
	structure_netto: number
	structure_selfprice: string
	structure_selfprice_netto: string
	structure_type: string
	structure_unit: string
}

export type PosterModification = {
	brutto: number
	dish_modification_id: number
	ingredient_id: number
	last_modified_time: string
	name: string
	photo_large: string
	photo_orig: string
	photo_small: string
	price: number
	sort_order: number
	type: number
}

export type PosterModificationGroup = {
	dish_modification_group_id: number
	is_deleted: number
	modifications: PosterModification[]
	name: string
	num_max: number
	num_min: number
	type: number
}

export type PosterProduct = {
	barcode: string
	category_name: string
	color: string
	cooking_time: string
	cost: string
	cost_netto: string
	different_spots_prices: string
	fiscal: string
	group_modifications?: PosterModificationGroup[]
	hidden: string
	ingredient_id: string
	ingredients: PosterIngredient[]
	master_id: string
	menu_category_id: string
	nodiscount: string
	out: number
	photo: string
	photo_origin: null | string
	price: Record<string, string>
	product_code: string
	product_id: string
	product_name: string
	product_production_description: string
	product_tax_id: string
	profit: Record<string, string>
	sort_order: string
	sources: unknown[]
	spots: {
		price: string
		profit: string
		profit_netto: string
		spot_id: string
		visible: string
	}[]
	tax_id: string
	type: string
	unit: string
	weight_flag: string
	workshop: string
}
