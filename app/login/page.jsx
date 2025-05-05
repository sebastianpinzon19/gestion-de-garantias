"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ThemeSwitcher from "@/components/common/theme-switcher"
import LanguageSwitcher from "@/components/common/language-switcher"

export default function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.message || t("loginError"))
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(t("loginError"))
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
                {loading ? t("loading") : t("login")}
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
                <p>
                  <strong>{t("customer")}:</strong> cliente@ejemplo.com / cliente123
                </p>
              </div>
            </div>
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
            <Link href="/register">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 dark:border-blue-700 dark:text-blue-400"
              >
                {t("register")}
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
