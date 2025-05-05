"use client";

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
  const { login, user, loading, error: authError, setError } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Limpiar errores cuando el componente se monta
    setError(null);
    setFormError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Validación básica del formulario
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        setFormError(result.message || 'Login failed');
      }
    } catch (err) {
      setFormError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario empieza a escribir
    if (formError) setFormError(null);
  };

  // Si está cargando o hay un usuario, mostrar el spinner
  if (loading || user) {
    return <LoadingSpinner />;
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {(formError || authError) && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {formError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Card>
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
    </div>
  );
}
