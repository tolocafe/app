import { ScrollViewStyleReset } from 'expo-router/html'
import React, { type PropsWithChildren } from 'react'

import '../lib/styles/unistyles' // Initialize Unistyles for web static rendering

export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="es">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>

				{/* SEO and Performance Meta Tags */}
				<meta name="theme-color" content="#ffffff" />
				<meta name="color-scheme" content="light dark" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="TOLO" />

				{/* Favicon and Icons */}
				<link rel="icon" href="/favicon.png" type="image/png" />
				<link rel="apple-touch-icon" href="/icon.png" />
				<link rel="manifest" href="/manifest.json" />

				{/* Default SEO - can be overridden per page */}
				<meta
					name="description"
					content="TOLO - Buen Café. Tu cafetería de barrio donde cada taza cuenta una historia"
				/>
				<meta
					name="keywords"
					content="TOLO, buen café, cafetería, espresso, latte, cappuccino, café de barrio, café casero"
				/>
				<meta name="author" content="TOLO Coffee Shop" />

				{/* Open Graph Meta Tags */}
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="TOLO Coffee Shop" />
				<meta property="og:title" content="TOLO - Buen Café" />
				<meta
					property="og:description"
					content="Tu cafetería de barrio donde cada taza cuenta una historia"
				/>
				<meta property="og:image" content="/icon.png" />
				<meta property="og:image:width" content="512" />
				<meta property="og:image:height" content="512" />
				<meta property="og:image:alt" content="Logo de TOLO Coffee Shop" />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="TOLO - Buen Café" />
				<meta
					name="twitter:description"
					content="Tu cafetería de barrio donde cada taza cuenta una historia"
				/>
				<meta name="twitter:image" content="/icon.png" />

				{/* Performance and Caching */}
				<meta
					httpEquiv="Cache-Control"
					content="public, max-age=31536000, immutable"
				/>

				{/* Disable body scrolling on web for native-like experience */}
				<ScrollViewStyleReset />
			</head>
			<body>{children}</body>
		</html>
	)
}
