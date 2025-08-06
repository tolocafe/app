# TOLO Coffee Shop App

React Native app for TOLO Coffee Shop built with Expo.

## Features

- **Menu**: Browse coffee, tea, pastries, and seasonal items
- **Store Info**: Location, hours, contact details
- **Localization**: English/Spanish support
- **Themes**: Light/dark mode

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
```

## Stack

- Expo Router for navigation
- React Native Unistyles for styling
- Lingui for internationalization
- TypeScript
- Expo Updates for OTA updates

## Updates

This app uses Expo Updates for over-the-air (OTA) updates with fingerprint runtime policy.

### Configuration

- **Project ID**: `25e3751a-b837-480a-b9fc-ee67327f46e9`
- **Runtime Policy**: Fingerprint
- **Update URL**: `https://u.expo.dev/25e3751a-b837-480a-b9fc-ee67327f46e9`

### Usage

The app automatically checks for updates on startup. You can also manually check for updates:

```typescript
import { checkForUpdates } from '@/lib/updates'

// Check for updates
await checkForUpdates()
```

### Publishing Updates

To publish an update:

```bash
# For production
eas update --branch production

# For preview
eas update --branch preview
```
