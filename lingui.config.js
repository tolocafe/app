/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
	locales: ['es', 'en'],
	sourceLocale: 'es',
	catalogs: [
		{
			path: 'src/locales/{locale}/messages',
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['**/node_modules/**', '**/dist/**'],
		},
	],
	format: 'po',
}
