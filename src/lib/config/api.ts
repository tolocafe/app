// API Configuration
// Always use real API endpoints

// API URLs
export const API_URLS = {
	production: 'https://app.tolo.cafe/api',
	development: 'http://localhost:8787/api', // For local Cloudflare Workers development
}

// Get the appropriate API URL based on environment
export const getApiUrl = () => {
	// Check if we're in development environment
	if (
		process.env.NODE_ENV === 'development' &&
		process.env.USE_LOCAL_API === 'true'
	) {
		return API_URLS.development
	}

	// Use production URL by default
	return API_URLS.production
}
