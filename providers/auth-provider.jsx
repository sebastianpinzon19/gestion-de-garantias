"use client"

<<<<<<< HEAD
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeTokenCookie as clearToken } from '@/lib/tokens'; // Removed verifyToken import
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthContext = createContext()

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/register', '/warranty-form']
=======
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Crear contexto de autenticación
const AuthContext = createContext()
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
  const [error, setError] = useState(null)
=======
  const [initialized, setInitialized] = useState(false)
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  const router = useRouter()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
<<<<<<< HEAD
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Fetch user profile from the server-side endpoint
        const response = await fetch('/api/profile');
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          } else {
            setUser(null);
            // Optional: clear token if server says user is null but cookie exists?
            // clearToken(); 
          }
        } else {
          // Handle non-200 responses, e.g., 401 Unauthorized or 500 Server Error
          console.error('Failed to fetch profile:', response.status);
          setUser(null);
          clearToken(); // Clear token if profile fetch fails significantly
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setUser(null);
        clearToken();
      } finally {
        setLoading(false);
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
      }
    };

<<<<<<< HEAD
    initializeAuth();
  }, []); // Dependency array is empty, runs once on mount

=======
    loadUserFromStorage()
  }, [])

  // Función para iniciar sesión
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

<<<<<<< HEAD
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (!data.success || !data.user) { // Check for user data as well
        throw new Error(data.message || 'Login failed');
      }

      // Set user state after successful login
      setUser(data.user);
      setLoading(false);
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'SELLER') {
        router.push('/seller/dashboard'); // Example seller dashboard route
      } // Removed default redirect to profile
      
      return { success: true, user: data.user };

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/logout', { method: 'POST' })
      clearToken()
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
