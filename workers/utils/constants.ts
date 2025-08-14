const TEST_PHONE_NUMBERS = process.env.TEST_PHONE_NUMBERS

export const testPhoneNumbers: string[] = (TEST_PHONE_NUMBERS ?? '').split(',')
