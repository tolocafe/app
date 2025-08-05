import { useLanguage } from '@/contexts/LanguageContext'
import { Trans } from '@lingui/macro'
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function More() {
  const { currentLanguage, changeLanguage } = useLanguage()
  const handleCall = () => {
    Linking.openURL('tel:+14155551234')
  }

  const handleDirections = () => {
    const address = '123 Coffee Street, San Francisco, CA 94105'
    const url = `https://maps.apple.com/?address=${encodeURIComponent(address)}`
    Linking.openURL(url)
  }

  const handleWebsite = () => {
    Linking.openURL('https://tolocoffee.com')
  }

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com/tolocoffee')
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          <Trans>About TOLO</Trans>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Location</Trans>
        </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Trans>TOLO Coffee Shop</Trans>
          </Text>
          <Text style={styles.cardText}>123 Coffee Street</Text>
          <Text style={styles.cardText}>San Francisco, CA 94105</Text>
          <TouchableOpacity style={styles.button} onPress={handleDirections}>
            <Text style={styles.buttonText}>
              <Trans>Get Directions</Trans>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Hours</Trans>
        </Text>
        <View style={styles.card}>
          <View style={styles.hoursRow}>
            <Text style={styles.dayText}>
              <Trans>Monday - Friday</Trans>
            </Text>
            <Text style={styles.hoursText}>6:00 AM - 8:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.dayText}>
              <Trans>Saturday</Trans>
            </Text>
            <Text style={styles.hoursText}>7:00 AM - 9:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.dayText}>
              <Trans>Sunday</Trans>
            </Text>
            <Text style={styles.hoursText}>7:00 AM - 7:00 PM</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Contact</Trans>
        </Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
            <Text style={styles.contactLabel}>
              <Trans>Phone</Trans>
            </Text>
            <Text style={styles.contactValue}>(415) 555-1234</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={handleWebsite}>
            <Text style={styles.contactLabel}>
              <Trans>Website</Trans>
            </Text>
            <Text style={styles.contactValue}>tolocoffee.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={handleInstagram}>
            <Text style={styles.contactLabel}>
              <Trans>Instagram</Trans>
            </Text>
            <Text style={styles.contactValue}>@tolocoffee</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Our Story</Trans>
        </Text>
        <View style={styles.card}>
          <Text style={styles.storyText}>
            <Trans>
              TOLO Coffee is a neighborhood coffee shop dedicated to serving the
              finest locally-roasted coffee. We believe in creating a warm,
              welcoming space where community comes together over exceptional
              coffee and fresh, locally-sourced food. Every cup tells a story,
              and we&apos;re here to make yours special.
            </Trans>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Our Values</Trans>
        </Text>
        <View style={styles.card}>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>
              <Trans>Quality First</Trans>
            </Text>
            <Text style={styles.valueText}>
              <Trans>We source only the best beans and ingredients</Trans>
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>
              <Trans>Community Focus</Trans>
            </Text>
            <Text style={styles.valueText}>
              <Trans>Building connections one cup at a time</Trans>
            </Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>
              <Trans>Sustainability</Trans>
            </Text>
            <Text style={styles.valueText}>
              <Trans>Committed to eco-friendly practices</Trans>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Trans>Language</Trans>
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.languageRow,
              currentLanguage === 'en' && styles.languageRowActive,
            ]}
            onPress={() => changeLanguage('en')}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === 'en' && styles.languageTextActive,
              ]}
            >
              English
            </Text>
            {currentLanguage === 'en' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageRow,
              currentLanguage === 'es' && styles.languageRowActive,
            ]}
            onPress={() => changeLanguage('es')}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === 'es' && styles.languageTextActive,
              ]}
            >
              Español
            </Text>
            {currentLanguage === 'es' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.primary,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  button: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  dayText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  hoursText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.body.fontWeight,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contactLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  contactValue: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: theme.typography.body.fontWeight,
  },
  storyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  valueItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  valueTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  valueText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  languageRowActive: {
    backgroundColor: theme.colors.background,
  },
  languageText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  languageTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.body.fontWeight,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
}))
