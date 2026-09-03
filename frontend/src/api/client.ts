const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export type ApiError = {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
    request_id?: string
  }
}

export type AuthUserDto = {
  id: number
  full_name: string
  username: string
  role: 'ADMIN' | 'SALES' | 'OWNER'
}

export type AuthResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  user: AuthUserDto
}

let accessToken: string | null = null
let refreshPromise: Promise<AuthResponse | null> | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

function makeHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers)

  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return headers
}

async function throwApiError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ApiError | null
  throw new Error(body?.error?.message ?? `HTTP ${response.status}`)
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim().toLowerCase(),
      password,
    }),
  })

  if (!response.ok) {
    return throwApiError(response)
  }

  const data = (await response.json()) as AuthResponse
  setAccessToken(data.access_token)

  return data
}

async function performRefresh(): Promise<AuthResponse | null> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (response.status === 401) {
    setAccessToken(null)
    return null
  }

  if (!response.ok) {
    return throwApiError(response)
  }

  const data = (await response.json()) as AuthResponse
  setAccessToken(data.access_token)

  return data
}

export function refreshSession(): Promise<AuthResponse | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function logoutRequest(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } finally {
    setAccessToken(null)
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  allowRefresh = true,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: makeHeaders(init),
  })

  if (response.status === 401 && allowRefresh) {
    const session = await refreshSession()

    if (session) {
      return apiRequest<T>(path, init, false)
    }
  }

  if (!response.ok) {
    return throwApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
