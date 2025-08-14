const TEST_PHONE_NUMBERS = process.env.TEST_PHONE_NUMBERS as string | undefined

export const testPhoneNumbers: string[] = (TEST_PHONE_NUMBERS ?? '').split(',')
