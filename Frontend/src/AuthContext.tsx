import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for saved session in memory (not localStorage per artifact rules)
    // In a real deployed app, this would persist via httpOnly cookies
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', { email, password })
      setToken(res.data.access_token)
      setUser(res.data.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/signup', { name, email, password })
      setToken(res.data.access_token)
      setUser(res.data.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || 'Signup failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)