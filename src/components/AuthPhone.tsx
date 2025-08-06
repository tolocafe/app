import { useState } from 'react'
import { View, TextInput, Button, Text, Alert } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useAuth } from '@/lib/hooks/use-auth'

export function AuthPhone() {
  const [stage, setStage] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const { requestOtp, signIn } = useAuth()

  const sendCode = async () => {
    try {
      await requestOtp(phone)
      setStage('code')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    }
  }
  const verify = async () => {
    try {
      await signIn(phone, code, 'mobile')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    }
  }

  return (
    <View style={styles.container}>
      {stage === 'phone' ? (
        <>
          <Text style={styles.label}>Phone number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Button title="Send Code" onPress={sendCode} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Verification code</Text>
          <TextInput style={styles.input} value={code} onChangeText={setCode} keyboardType="number-pad" />
          <Button title="Verify" onPress={verify} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: { gap: theme.spacing.md },
  label: { color: theme.colors.text },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    padding: theme.spacing.sm,
    borderRadius: 4,
  },
}))