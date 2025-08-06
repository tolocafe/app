# TOLO Coffee Shop App

React Native app for TOLO Coffee Shop built with Expo.

## Features

- **Menu**: Browse coffee, tea, pastries, and seasonal items
- **Store Info**: Location, hours, contact details
- **Localization**: English/Spanish support
- **Themes**: Light/dark mode
- **OTA Updates**: Over-the-air updates with fingerprint runtime policy

## Quick Start

```bash
# Install
bun install

# Run
bun run ios     # iOS
bun run android # Android
bun run web     # Web

# Translations
bun run lingui:extract  # Extract strings
bun run lingui:compile  # Compile

# Updates
bun run update:publish              # Publish update to all channels
bun run update:publish:preview      # Publish to preview channel
bun run update:publish:production   # Publish to production channel
```

## Stack

- Expo Router for navigation
- React Native Unistyles for styling  
- Lingui for internationalization
- Expo Updates with fingerprint runtime policy
- TypeScript

## Expo Updates Configuration

This app is configured with `expo-updates` using fingerprint as the runtime policy:

- **Project ID**: `25e3751a-b837-480a-b9fc-ee67327f46e9`
- **Runtime Policy**: `fingerprint` - Updates are only applied when the native runtime is compatible
- **Update URL**: `https://u.expo.dev/25e3751a-b837-480a-b9fc-ee67327f46e9`
- **Channels**: `development`, `preview`, `production`

### How Updates Work

1. **Automatic Checking**: The app checks for updates on launch (production builds only)
2. **Fingerprint Validation**: Updates are only downloaded if the runtime fingerprint matches
3. **Seamless Installation**: Updates are applied automatically and the app reloads
4. **Error Handling**: Update errors are captured to Sentry with context and don't crash the app
5. **Silent Updates**: No UI components - updates happen transparently in the background

### Publishing Updates

```bash
# Publish to all channels (matches git branch)
eas update --auto

# Publish to specific channel with message
eas update --channel production --message "Bug fixes and performance improvements"

# Publish to preview channel
eas update --channel preview --message "Testing new features"
```
