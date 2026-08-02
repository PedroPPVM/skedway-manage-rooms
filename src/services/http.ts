export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      body?.code ?? 'UNKNOWN_ERROR',
      body?.message ?? 'Erro inesperado. Tente novamente.',
    )
  }
  return response.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path)
  return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response)
}

export async function apiDelete(
  path: string,
  headers: Record<string, string> = {},
): Promise<void> {
  const response = await fetch(path, { method: 'DELETE', headers })

  if (!response.ok) {
    await handleResponse(response)
  }
}
