import * as Sentry from '@sentry/react-native'

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		Sentry.mobileReplayIntegration(),
		Sentry.feedbackIntegration(),
	],
	replaysOnErrorSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	sendDefaultPii: false,
})
