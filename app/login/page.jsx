"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/context/language-context"

export default function Login() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const router = useRouter()

  // Verificar si ya hay una sesión activa
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
          // Limpiar datos inválidos
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
      console.log("Intentando iniciar sesión con:", email, password)

      // Para propósitos de demostración, permitir acceso con credenciales específicas
      if (email === "admin@ejemplo.com" && password === "admin123") {
        console.log("Credenciales de administrador correctas")

        const userData = {
          id: "1",
          name: "Administrador",
          email: "admin@ejemplo.com",
          role: "admin",
        }

        // Guardar datos en localStorage
        localStorage.setItem("token", "demo-token-admin")
        localStorage.setItem("user", JSON.stringify(userData))

        // Establecer cookie para el middleware
        document.cookie = `token=demo-token-admin; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redireccionar después de un breve retraso
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)

        return
      }

      if (email === "vendedor@ejemplo.com" && password === "vendedor123") {
        console.log("Credenciales de vendedor correctas")

        const userData = {
          id: "2",
          name: "Vendedor Demo",
          email: "vendedor@ejemplo.com",
          role: "seller",
        }

        // Guardar datos en localStorage
        localStorage.setItem("token", "demo-token-seller")
        localStorage.setItem("user", JSON.stringify(userData))

        // Establecer cookie para el middleware
        document.cookie = `token=demo-token-seller; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`

        setLoginSuccess(true)

        // Redireccionar después de un breve retraso
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)

        return
      }

      // Si las credenciales no coinciden con las predefinidas
      setError(t("incorrectCredentials"))
    } catch (err) {
      console.error("Error during login:", err)
      setError(t("loginError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-yellow-100 dark:from-blue-900 dark:to-yellow-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-t-4 border-blue-500 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300">
            {t("login")}
          </CardTitle>
          <CardDescription className="text-center">{t("loginToSystem")}</CardDescription>
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
                Inicio de sesión exitoso. Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
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
              {loading ? t("loggingIn") : t("login")}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-md border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">{t("demoCredentials")}</p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                <strong>{t("admin")}:</strong> admin@ejemplo.com / admin123
              </p>
              <p>
                <strong>{t("seller")}:</strong> vendedor@ejemplo.com / vendedor123
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
              {t("back")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

