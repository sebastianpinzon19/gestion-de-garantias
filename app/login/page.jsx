"use client"

import { useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { LoginForm } from "@modules/auth/components/LoginForm"

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      const result = await login(credentials)
      
      if (!result.success) {
        setError(result.message)
      }
    } catch (error) {
      setError("Error connecting to the server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Login
          </h2>
        </div>
        <LoginForm onSubmit={handleLogin} error={error} isLoading={isLoading} />
      </div>
    </div>
  )
}
