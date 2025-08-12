import type { ComponentProps } from 'react'

import { Tabs as ExpoRouterTabs } from 'expo-router'

/** Render  */
export default function Tabs(props: ComponentProps<typeof ExpoRouterTabs>) {
	return <ExpoRouterTabs {...props} />
}
