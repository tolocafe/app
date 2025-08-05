import { ScrollViewStyleReset } from 'expo-router/html'
import React, { type PropsWithChildren } from 'react'

import '../lib/styles/unistyles' // Initialize Unistyles for web static rendering

export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>

				{/* Add any custom head elements here */}
				<ScrollViewStyleReset />
			</head>
			<body>{children}</body>
		</html>
	)
}
