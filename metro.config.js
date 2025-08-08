/* eslint-disable no-undef */
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

const config = getSentryExpoConfig(__dirname)

// Required for zustand
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native']

module.exports = config
