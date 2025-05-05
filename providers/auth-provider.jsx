"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeTokenCookie as clearToken } from '@/lib/tokens'; // Removed verifyToken import
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthContext = createContext()

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/register', '/warranty-form']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
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
      }
    };

    initializeAuth();
  }, []); // Dependency array is empty, runs once on mount

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
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

