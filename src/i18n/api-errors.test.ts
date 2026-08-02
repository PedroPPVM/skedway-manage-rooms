import { API_ERROR_CODES, getApiErrorKey } from './api-errors'
import en from './locales/en.json'
import es from './locales/es.json'
import ptBR from './locales/pt-BR.json'

describe('getApiErrorKey', () => {
  it.each(API_ERROR_CODES)('maps %s to its translation key', (code) => {
    expect(getApiErrorKey(code)).toBe(`errors.${code}`)
  })

  it('falls back to the unexpected error for unknown codes', () => {
    expect(getApiErrorKey('SOMETHING_ELSE')).toBe('errors.unexpected')
    expect(getApiErrorKey(undefined)).toBe('errors.unexpected')
  })

  it('has every error translated in all locales', () => {
    for (const locale of [ptBR, en, es]) {
      for (const code of [...API_ERROR_CODES, 'unexpected'] as const) {
        expect(locale.errors[code]).toBeTruthy()
      }
    }
  })
})
