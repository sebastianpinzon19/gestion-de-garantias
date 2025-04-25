"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        const user = JSON.parse(userData)
        setUser(user)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Para demo, usamos credenciales hardcodeadas
      if (email === "admin@ejemplo.com" && password === "admin123") {
        const userData = {
          id: "1",
          name: "Administrator",
          email: "admin@ejemplo.com",
          role: "admin",
        }
        localStorage.setItem("token", "demo-token-admin")
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true, role: "admin" }
      }

      if (email === "vendedor@ejemplo.com" && password === "vendedor123") {
        const userData = {
          id: "2",
          name: "Demo Seller",
          email: "vendedor@ejemplo.com",
          role: "seller",
        }
        localStorage.setItem("token", "demo-token-seller")
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true, role: "seller" }
      }

      throw new Error("Credenciales incorrectas")
    } catch (error) {
      console.error("Error during login:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  }
} 