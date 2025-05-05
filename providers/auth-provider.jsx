"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Crear contexto de autenticación
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading user from storage:", error)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    loadUserFromStorage()
  }, [])

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        return { success: false, message: data.message }
      }

      // Guardar datos en localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Actualizar estado
      setUser(data.user)

      // Redireccionar según el rol
      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (data.user.role === "seller") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Error al iniciar sesión" }
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Llamar a la API para invalidar el token
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Limpiar localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Actualizar estado
      setUser(null)

      // Redireccionar a la página de inicio
      router.push("/")
    }
  }

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!data.success) {
        return { success: false, message: data.message }
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, message: "Error al registrar usuario" }
    }
  }

  // Función para actualizar el perfil del usuario
  const updateProfile = async (userData) => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!data.success) {
        return { success: false, message: data.message }
      }

      // Actualizar localStorage y estado
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)

      return { success: true, user: data.user }
    } catch (error) {
      console.error("Update profile error:", error)
      return { success: false, message: "Error al actualizar perfil" }
    }
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        login,
        logout,
        register,
        updateProfile,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
