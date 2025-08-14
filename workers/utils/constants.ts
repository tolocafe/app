// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const TEST_PHONE_NUMBERS = process.env.TEST_PHONE_NUMBERS as string | undefined

export const testPhoneNumbers = TEST_PHONE_NUMBERS?.split(',') ?? []
