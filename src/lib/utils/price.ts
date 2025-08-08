/**
 * Formats Poster product prices which are returned as strings/numbers in cents.
 * Example: "250" (cents) -> "$2.50"
 */
export function formatPosterPrice(value: number | string): string {
	const cents = typeof value === 'string' ? Number.parseFloat(value) : value
	if (!Number.isFinite(cents)) return '$0.00'
	const dollars = cents / 100
	return `$${dollars.toFixed(2)}`
}
