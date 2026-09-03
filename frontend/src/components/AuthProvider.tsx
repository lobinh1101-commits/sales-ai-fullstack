import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  loginRequest,
  logoutRequest,
  refreshSession,
  type AuthUserDto,
} from '../api/client'

import type { AuthUser, Role } from '../types'

type AuthContextValue = {
  user: AuthUser | null
  initializing: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toAuthUser(user: AuthUserDto): AuthUser {
  return {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    role: user.role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initializing, setInitializing] = useState(true)
  const bootstrapped = useRef(false)

  useEffect(() => {
    if (bootstrapped.current) return

    bootstrapped.current = true

    void refreshSession()
      .then((session) => {
        setUser(session ? toAuthUser(session.user) : null)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setInitializing(false)
      })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,

      async login(username, password) {
        try {
          const session = await loginRequest(username, password)

          setUser(toAuthUser(session.user))

          return true
        } catch {
          setUser(null)
          return false
        }
      },

      async logout() {
        try {
          await logoutRequest()
        } finally {
          setUser(null)
        }
      },

      hasRole(...roles) {
        return !!user && roles.includes(user.role)
      },
    }),
    [initializing, user],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
