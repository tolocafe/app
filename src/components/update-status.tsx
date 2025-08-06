import { Text, View } from 'react-native'
import { useUpdates } from '@/lib/hooks/use-updates'

export function UpdateStatus() {
	const updates = useUpdates()

	if (__DEV__) {
		return (
			<View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
				<Text>Development Mode - Updates Disabled</Text>
				<Text>Runtime Version: {updates.runtimeVersion || 'N/A'}</Text>
				<Text>Channel: {updates.channel || 'N/A'}</Text>
			</View>
		)
	}

	if (updates.isChecking) {
		return (
			<View style={{ padding: 10, backgroundColor: '#e3f2fd' }}>
				<Text>Checking for updates...</Text>
			</View>
		)
	}

	if (updates.isDownloading) {
		return (
			<View style={{ padding: 10, backgroundColor: '#fff3e0' }}>
				<Text>Downloading update...</Text>
			</View>
		)
	}

	if (updates.error) {
		return (
			<View style={{ padding: 10, backgroundColor: '#ffebee' }}>
				<Text>Update error: {updates.error}</Text>
			</View>
		)
	}

	return null
}