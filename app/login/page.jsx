"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const router = useRouter()

  // Check if a session is already active
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          if (user.role === "admin") {
            router.push("/admin/dashboard")
          } else if (user.role === "seller") {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
          // Clear invalid data
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting to log in with:", email, password)

      // For demonstration purposes, allow access with specific credentials
      if (email === "admin@ejemplo.com" && password === "admin123") {
        console.log("Admin credentials correct")

        const userData = {
          id: "1",
          name: "Administrator",
          email: "admin@ejemplo.com",
          role: "admin",
        }

        // Save data in localStorage
        localStorage.setItem("token", "demo-token-admin")
        localStorage.setItem("user", JSON.stringify(userData))

        // Set cookie for middleware
        document.cookie = `token=demo-token-admin; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redirect after a brief delay
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)

        return
      }

      if (email === "vendedor@ejemplo.com" && password === "vendedor123") {
        console.log("Seller credentials correct")

        const userData = {
          id: "2",
          name: "Demo Seller",
          email: "vendedor@ejemplo.com",
          role: "seller",
        }

        // Save data in localStorage
        localStorage.setItem("token", "demo-token-seller")
        localStorage.setItem("user", JSON.stringify(userData))

        // Set cookie for middleware
        document.cookie = `token=demo-token-seller; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redirect after a brief delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)

        return
      }

      // If credentials do not match predefined ones
      setError("Incorrect credentials")
    } catch (err) {
      console.error("Error during login:", err)
      setError("Login error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-yellow-100 dark:from-blue-900 dark:to-yellow-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-t-4 border-blue-500 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loginSuccess && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Login successful. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-md border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Demo Credentials</p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                <strong>Admin:</strong> admin@ejemplo.com / admin123
              </p>
              <p>
                <strong>Seller:</strong> vendedor@ejemplo.com / vendedor123
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
            >
              Back
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
