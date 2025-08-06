import * as Updates from 'expo-updates'

/**
 * Check for and apply updates
 * This function checks for available updates and applies them if available
 */
export async function checkForUpdates(): Promise<void> {
  try {
    const update = await Updates.checkForUpdateAsync()
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }
  } catch (error) {
    console.log('Error checking for updates:', error)
  }
}

/**
 * Get the current update ID
 * This can be used to track which update version is currently running
 */
export function getUpdateId(): string | null {
  return Updates.updateId
}

/**
 * Get the current runtime version
 * This returns the version of the app that is currently running
 */
export function getRuntimeVersion(): string | null {
  return Updates.runtimeVersion
}

/**
 * Check if updates are enabled
 * This returns whether updates are enabled for the current build
 */
export function isUpdateEnabled(): boolean {
  return Updates.isEnabled
}

/**
 * Check if the app is running from a development build
 * This returns whether the app is running in development mode
 */
export function isDevelopmentBuild(): boolean {
  return Updates.isEmbeddedLaunch
}