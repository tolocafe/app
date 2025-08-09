/* eslint-disable no-undef, unicorn/no-anonymous-default-export */

module.exports = (api) => {
	api.cache(true)

	return {
		plugins: [
			[
				'react-native-unistyles/plugin',
				{
					exclude: ['node_modules'],
					root: 'src',
				},
			],
			'@lingui/babel-plugin-lingui-macro',
			'react-native-reanimated/plugin',
		],
		presets: [['babel-preset-expo']],
	}
}
