# TOLO Coffee Shop App

React Native app for TOLO Coffee Shop built with Expo.

## Features

- **Menu**: Browse coffee, tea, pastries, and seasonal items
- **Store Info**: Location, hours, contact details
- **Localization**: English/Spanish support
- **Themes**: Light/dark mode

## Quick Start

### Prerequisites

This project uses [Bun](https://bun.sh) as the package manager. If you don't have Bun installed:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or use the provided script
./scripts/install-bun.sh
```

### Development

```bash
# Install dependencies
bun install

# Run development server
bun start     # Start Expo dev server
bun ios       # iOS simulator
bun android   # Android emulator
bun web       # Web browser

# Translations
bun lingui:extract  # Extract strings
bun lingui:compile  # Compile translations

# Package management
bun add <package>   # Add dependency
bun remove <package> # Remove dependency
bun update          # Update dependencies

# Verify setup
./scripts/verify-setup.sh  # Verify project configuration
```

## Stack

- **Package Manager**: Bun (fast, reliable JavaScript runtime & package manager)
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
bunx eas update --branch production

# For preview
bunx eas update --branch preview
```
