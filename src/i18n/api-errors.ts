export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'ROOM_NOT_FOUND',
  'INVALID_DURATION',
  'OUTSIDE_BUSINESS_HOURS',
  'TIME_CONFLICT',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

type ApiErrorKey = `errors.${ApiErrorCode | 'unexpected'}`

export function getApiErrorKey(code?: string): ApiErrorKey {
  if ((API_ERROR_CODES as readonly string[]).includes(code ?? '')) {
    return `errors.${code as ApiErrorCode}`
  }
  return 'errors.unexpected'
}
