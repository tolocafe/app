import * as Sentry from '@sentry/react-native'

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN as string

Sentry.init({
	dsn,
	integrations: [
		Sentry.mobileReplayIntegration(),
		Sentry.feedbackIntegration(),
	],
	replaysOnErrorSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	sendDefaultPii: false,
})
