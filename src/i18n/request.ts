import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') ?? ''

  // Parse the first preferred language tag (e.g. "fr-FR,fr;q=0.9" → "fr")
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.split(';')[0]?.trim() ?? ''
  const locale = routing.locales.includes(preferred as 'fr' | 'en')
    ? (preferred as 'fr' | 'en')
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
