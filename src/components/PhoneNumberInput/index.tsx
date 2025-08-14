import type { ComponentProps } from 'react'
import { TextInput, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'
import * as DropdownMenu from 'zeego/dropdown-menu'

import { Text } from '@/components/Text'

export type CountryCode = 'MX' | 'US'

export type PhoneNumberInputProps = {
	countries?: CountryCode[]
	inputProps?: Omit<ComponentProps<typeof TextInput>, 'onChangeText' | 'placeholder' | 'value'>
	onChangeText: (next: string) => void
	placeholder?: string
	value: string
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
		const digits = text.replaceAll(/\D/g, '')
		onChangeText(toE164FromNational(digits, selectedCountry))
	}

	const handleSelectCountry = (country: CountryCode) => {
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
				autoComplete={inputProps?.autoComplete ?? 'tel'}
				keyboardType={inputProps?.keyboardType ?? 'phone-pad'}
				onChangeText={handleChangeText}
				placeholder={placeholder}
				style={[styles.input, inputProps?.style]}
				textContentType={inputProps?.textContentType ?? 'telephoneNumber'}
				value={display}
			/>
		</View>
	)
}

function formatNationalForDisplay(nationalDigits: string, country: CountryCode): string {
	const digits = nationalDigits.replaceAll(/\D/g, '')
	if (country === 'US') {
		if (digits.length <= 3) return digits
		if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
		return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
	}
	if (digits.length <= 2) return digits
	if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`
	return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`
}

function getCountryFromValue(value: string | undefined): CountryCode {
	if (!value) return 'US'
	if (value.startsWith('+52')) return 'MX'
	if (value.startsWith('+1')) return 'US'
	return 'US'
}

function getDialCode(country: CountryCode): string {
	return country === 'MX' ? '+52' : '+1'
}

function getFlag(country: CountryCode): string {
	return country === 'MX' ? '🇲🇽' : '🇺🇸'
}

function getNationalDigitsFromE164(internationalPhone: string | undefined): string {
	if (!internationalPhone) return ''
	const digits = internationalPhone.replaceAll(/\D/g, '')
	if (digits.startsWith('52')) return digits.slice(2)
	if (digits.startsWith('1')) return digits.slice(1)
	return digits
}

function toE164FromNational(nationalDigits: string, country: CountryCode): string {
	const normalized = nationalDigits.replaceAll(/\D/g, '')
	if (normalized.length === 0) return ''
	return country === 'MX' ? `+52${normalized}` : `+1${normalized}`
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
