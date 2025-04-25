"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  const setCookie = (name, value, days) => {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/`
  }

  const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }

  useEffect(() => {
    const token = getCookie("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        removeCookie("token")
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Si estamos en login o home, limpiar la sesión
    if (pathname === "/login" || pathname === "/") {
      setUser(null)
      return
    }

    // Si estamos en una ruta protegida y no hay usuario, redirigir a login
    if ((pathname.startsWith("/admin") || pathname.startsWith("/seller")) && !user) {
      router.replace("/login")
    }
  }, [pathname, router, user])

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        setCookie("token", data.token, 7)

        if (data.user.role === "admin") {
          router.replace("/admin/dashboard")
        } else {
          router.replace("/seller/dashboard")
        }

        return { success: true }
      } else {
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Server connection error" }
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    removeCookie("token")
    router.replace("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

