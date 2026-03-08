import axios, { isAxiosError } from 'axios'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  userId: string
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const payload = {
    email: request.username,
    Password: request.password,
  }

  try {
    const response = await axios.post<unknown>('http://localhost:5000/users/login', payload)
    const data = response.data as any

    let token: string | undefined
    let userId: string | undefined

    if (typeof data === 'string') {
      token = data
    } else if (data && typeof data === 'object') {
      // Backend issues "jwtToken" on success
      token = data.jwtToken ?? data.token ?? data.accessToken ?? data.jwt
      userId = data.userId
    }

    if (!token) {
      throw new Error('Login response did not include a token')
    }

    return { token, userId: userId ?? '' }
  } catch (error) {
    if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') {
      const problem = error.response.data as { detail?: string; title?: string }
      if (problem.detail) {
        throw new Error(problem.detail)
      }
      if (problem.title) {
        throw new Error(problem.title)
      }
    }

    throw error instanceof Error ? error : new Error('Login failed')
  }
}

