/**
 * Formats Poster product prices which are returned as strings/numbers in cents.
 * Remove cents if they are 00.
 * Example: "250" (cents) -> "$2.50", "300" -> "$3"
 */
export function formatPosterPrice(value: number | string): string {
	const cents = typeof value === 'string' ? Number.parseFloat(value) : value
	if (!Number.isFinite(cents)) return '$0.00'
	const dollars = cents / 100
	if (dollars % 1 === 0) return `$${dollars}`
	return `$${dollars.toFixed(2)}`
}
