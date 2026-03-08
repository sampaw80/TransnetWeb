import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { httpClient } from '../../api/httpClient'
import { login as loginRequest, type LoginRequest } from './authApi'

type AuthContextValue = {
  token: string | null
  userId: string | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const setAuthToken = (value: string | null) => {
    setToken(value)
    if (value) {
      httpClient.defaults.headers.common.Authorization = `Bearer ${value}`
    } else {
      delete httpClient.defaults.headers.common.Authorization
    }
  }

  const login = async (credentials: LoginRequest) => {
    const { token: nextToken, userId: nextUserId } = await loginRequest(credentials)
    // Best practice: keep access token in memory and keep it short-lived.
    setAuthToken(nextToken)
    setUserId(nextUserId)
  }

  const logout = () => {
    setAuthToken(null)
    setUserId(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, userId],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

