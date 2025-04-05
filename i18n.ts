import i18n from 'i18next'

// Dynamically import locale file to support both ESM & CommonJS
import translationEN from '#root/locales/en'
;(async () => {
	const resources = {
		en: { translation: translationEN },
	}
	// Initialize i18n
	const config = {
		resources,
		lng: 'en', // Default language
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // React already handles escaping
		},
		returnNull: false,
		returnEmptyString: false,
		parseMissingKeyHandler: (key: string) => {
			throw new Error(`Missing locale value for key: '${key}'`)
		},
	}

	const { initReactI18next } = await import('react-i18next')
	await i18n.use(initReactI18next).init(config)
})()

export default i18n
