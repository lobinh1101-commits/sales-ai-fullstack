import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { demoUsers } from '../data/demo'
import type { DemoUser, Role } from '../types'

type AuthContextValue = {
  user: DemoUser | null
  login: (username: string, password: string) => boolean
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => {
    const raw = sessionStorage.getItem('sales-ai-demo-user')
    return raw ? (JSON.parse(raw) as DemoUser) : null
  })

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login(username, password) {
      const found = demoUsers.find(
        (item) => item.username === username.trim().toLowerCase() && item.password === password,
      )
      if (!found) return false
      setUser(found)
      sessionStorage.setItem('sales-ai-demo-user', JSON.stringify(found))
      return true
    },
    logout() {
      setUser(null)
      sessionStorage.removeItem('sales-ai-demo-user')
    },
    hasRole(...roles) {
      return !!user && roles.includes(user.role)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
