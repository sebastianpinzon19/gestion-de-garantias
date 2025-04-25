"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/modules/auth/components/LoginForm"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

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
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        if (data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/seller/dashboard")
        }
      } else {
        setError(data.message || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error al conectar con el servidor")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>
        </div>
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  )
} 