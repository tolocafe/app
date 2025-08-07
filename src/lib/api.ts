export const BASE_URL = process.env.EXPO_PUBLIC_API_URL
export const POSTER_BASE_URL = process.env.EXPO_PUBLIC_POSTER_API_URL

export interface PosterCategory {
	category_id: string
	category_name: string
	category_photo: string | null
	category_photo_origin: string | null
	parent_category: string
	category_color: string
	category_hidden: string
	sort_order: string
	fiscal: string
	nodiscount: string
	tax_id: string
	left: string
	right: string
	level: string
	category_tag: string | null
	visible: {
		spot_id: number
		visible: number
	}[]
}

export interface PosterIngredient {
	structure_id: string
	ingredient_id: string
	pr_in_clear: string
	pr_in_cook: string
	pr_in_fry: string
	pr_in_stew: string
	pr_in_bake: string
	structure_unit: string
	structure_type: string
	structure_brutto: number
	structure_netto: number
	structure_lock: string
	structure_selfprice: string
	structure_selfprice_netto: string
	ingredient_name: string
	ingredient_unit: string
	ingredient_weight: number
	ingredients_losses_clear: string
	ingredients_losses_cook: string
	ingredients_losses_fry: string
	ingredients_losses_stew: string
	ingredients_losses_bake: string
}

export interface PosterModification {
	dish_modification_id: number
	name: string
	ingredient_id: number
	type: number
	brutto: number
	price: number
	photo_orig: string
	photo_large: string
	photo_small: string
	sort_order: number
	last_modified_time: string
}

export interface PosterModificationGroup {
	dish_modification_group_id: number
	name: string
	num_min: number
	num_max: number
	type: number
	is_deleted: number
	modifications: PosterModification[]
}

export interface PosterProduct {
	product_id: string
	product_name: string
	product_code: string
	barcode: string
	category_name: string
	menu_category_id: string
	price: Record<string, string>
	unit: string
	cost: string
	cost_netto: string
	fiscal: string
	hidden: string
	workshop: string
	nodiscount: string
	photo: string
	photo_origin: string | null
	profit: Record<string, string>
	sort_order: string
	tax_id: string
	product_tax_id: string
	type: string
	weight_flag: string
	color: string
	spots: {
		spot_id: string
		price: string
		profit: string
		profit_netto: string
		visible: string
	}[]
	ingredient_id: string
	cooking_time: string
	different_spots_prices: string
	sources: any[]
	master_id: string
	out: number
	product_production_description: string
	ingredients: PosterIngredient[]
	group_modifications?: PosterModificationGroup[]
}

export interface PosterApiResponse<T> {
	response: T
	error?: string
}

export interface ClientData {
	client_id?: string
	id?: string
	phone: string
	name?: string
	email?: string
	[key: string]: any
}
