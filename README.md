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
bun ios     # iOS
bun android # Android
bun web     # Web

# Translations
bun lingui:extract  # Extract strings
bun lingui:compile  # Compile

# Updates
bun update:publish              # Publish update to all channels
bun update:publish:preview      # Publish to preview channel
bun update:publish:production   # Publish to production channel
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
4. **Error Handling**: Update errors are logged and don't crash the app

### Publishing Updates

```bash
# Publish to all channels (matches git branch)
eas update --auto

# Publish to specific channel with message
eas update --channel production --message "Bug fixes and performance improvements"

# Publish to preview channel
eas update --channel preview --message "Testing new features"
```
