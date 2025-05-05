"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ThemeSwitcher from "@/components/common/theme-switcher"
import LanguageSwitcher from "@/components/common/language-switcher"

export default function Register() {
  const { register } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"))
      setLoading(false)
      return
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError(t("passwordMinLength"))
      setLoading(false)
      return
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer", // Por defecto, los usuarios registrados son clientes
      })

      if (result.success) {
        // Redirigir a login
        router.push("/login")
      } else {
        setError(result.message || t("registerError"))
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(t("registerError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold">{t("warrantySystem")}</h1>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <Card className="w-full max-w-md border-t-4 border-blue-500 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-blue-800 dark:text-blue-300">
              {t("register")}
            </CardTitle>
            <CardDescription className="text-center">{t("createAccount")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600"
                disabled={loading}
              >
                {loading ? t("loading") : t("register")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              >
                {t("back")}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 dark:border-blue-700 dark:text-blue-400"
              >
                {t("login")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2023 Sistema de Garantías. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
