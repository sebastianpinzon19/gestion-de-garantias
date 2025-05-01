"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext()

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/register', '/warranty-form']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        setUser(null)
        return false
      }

      const data = await response.json()
      setUser(data.user)
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Si es una ruta pública, no necesitamos verificar la autenticación
        if (publicRoutes.includes(pathname)) {
          setLoading(false)
          return
        }

        const success = await refreshToken()
        if (!success) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Configurar refresh token periódico (cada 14 minutos)
    const refreshInterval = setInterval(refreshToken, 14 * 60 * 1000)
    return () => clearInterval(refreshInterval)
  }, [pathname])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.error }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

