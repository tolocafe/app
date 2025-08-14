import React from 'react'
import { TextInput, View } from 'react-native'

import * as DropdownMenu from 'zeego/dropdown-menu'

import { StyleSheet } from 'react-native-unistyles'

import { Text } from '@/components/Text'

export type CountryCode = 'US' | 'MX'

export type PhoneNumberInputProps = {
	value: string
	onChangeText: (next: string) => void
	placeholder?: string
	countries?: CountryCode[]
	inputProps?: Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'placeholder'>
}

function getCountryFromValue(value: string | undefined): CountryCode {
	if (!value) return 'US'
	if (value.startsWith('+52')) return 'MX'
	if (value.startsWith('+1')) return 'US'
	return 'US'
}

function getNationalDigitsFromE164(e164: string | undefined): string {
	if (!e164) return ''
	const digits = e164.replace(/\D/g, '')
	if (digits.startsWith('52')) return digits.slice(2)
	if (digits.startsWith('1')) return digits.slice(1)
	return digits
}

function toE164FromNational(nationalDigits: string, country: CountryCode): string {
	const normalized = nationalDigits.replace(/\D/g, '')
	if (normalized.length === 0) return ''
	return country === 'MX' ? `+52${normalized}` : `+1${normalized}`
}

function formatNationalForDisplay(nationalDigits: string, country: CountryCode): string {
	const digits = nationalDigits.replace(/\D/g, '')
	if (country === 'US') {
		if (digits.length <= 3) return digits
		if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
	}
	// MX: 10-digit national number displayed as `AA AAAA AAAA`
	if (digits.length <= 2) return digits
	if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`
	return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`
}

function getDialCode(country: CountryCode): string {
	return country === 'MX' ? '+52' : '+1'
}

function getCountryLabel(country: CountryCode): string {
	return country === 'MX' ? 'Mexico' : 'United States'
}

function getFlag(country: CountryCode): string {
	return country === 'MX' ? '🇲🇽' : '🇺🇸'
}

export default function PhoneNumberInput({
	countries = ['US', 'MX'],
	inputProps,
	onChangeText,
	placeholder = 'Phone number',
	value,
}: PhoneNumberInputProps) {
	const selectedCountry = getCountryFromValue(value)
	const nationalDigits = getNationalDigitsFromE164(value)
	const display = formatNationalForDisplay(nationalDigits, selectedCountry)

	const handleChangeText = (text: string) => {
		const digits = text.replace(/\D/g, '')
		onChangeText(toE164FromNational(digits, selectedCountry))
	}

	const handleSelectCountry = (country: CountryCode) => {
		// Keep current national digits, only change dial code
		const next = toE164FromNational(nationalDigits, country)
		onChangeText(next)
	}

	return (
		<View style={styles.row}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<View style={styles.countryTrigger}>
						<Text style={styles.countryText}>
							{getFlag(selectedCountry)} {getDialCode(selectedCountry)}
						</Text>
						<Text style={styles.countryArrow}>▼</Text>
					</View>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{countries.includes('US') && (
						<DropdownMenu.Item key="US" onSelect={() => handleSelectCountry('US')}>
							<DropdownMenu.ItemTitle>
								United States (+1)
							</DropdownMenu.ItemTitle>
						</DropdownMenu.Item>
					)}
					{countries.includes('MX') && (
						<DropdownMenu.Item key="MX" onSelect={() => handleSelectCountry('MX')}>
							<DropdownMenu.ItemTitle>Mexico (+52)</DropdownMenu.ItemTitle>
						</DropdownMenu.Item>
					)}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<TextInput
				{...inputProps}
				keyboardType={inputProps?.keyboardType ?? 'phone-pad'}
				placeholder={placeholder}
				onChangeText={handleChangeText}
				value={display}
				style={[styles.input, inputProps?.style]}
				textContentType={inputProps?.textContentType ?? 'telephoneNumber'}
				autoComplete={inputProps?.autoComplete ?? 'tel'}
			/>
		</View>
	)
}

const styles = StyleSheet.create((theme) => ({
	countryArrow: {
		color: theme.colors.textSecondary,
		fontSize: 12,
		marginLeft: theme.spacing.xs,
	},
	countryText: {
		color: theme.colors.text,
	},
	countryTrigger: {
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		flexDirection: 'row',
		gap: theme.spacing.xs,
		marginRight: theme.spacing.sm,
		minWidth: 84,
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.sm,
	},
	input: {
		backgroundColor: theme.colors.surface,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		color: theme.colors.text,
		flex: 1,
		padding: theme.spacing.sm,
	},
	row: {
		alignItems: 'center',
		flexDirection: 'row',
	},
}))