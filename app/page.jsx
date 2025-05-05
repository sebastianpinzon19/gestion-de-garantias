"use client"

<<<<<<< HEAD
import React from "react";
import SiteHeader from "@/components/layout/site-header";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleWarrantyForm = () => {
    router.push('/warranty-form');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleDashboard = () => {
    if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (user?.role === 'SELLER') {
      router.push('/seller/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-yellow-500">
      <SiteHeader />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Warranty System
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Digitize the warranty management process to eliminate paperwork, allowing customers to submit requests and sellers to manage them easily.
          </p>
=======
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/language-provider"
import Link from "next/link"
import ThemeSwitcher from "@/components/common/theme-switcher"
import LanguageSwitcher from "@/components/common/language-switcher"

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirigir según el rol
      if (user?.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user?.role === "seller") {
        router.push("/vendedor/dashboard")
      } else if (user?.role === "customer") {
        router.push("/cliente/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("warrantySystem")}</h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link href="/login">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">{t("login")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">{t("warrantySystem")}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sistema completo para la gestión de garantías de productos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">{t("customer")}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Solicita garantías para tus productos y realiza seguimiento a tus solicitudes
              </p>
              <Link href="/garantia/nueva">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">{t("newWarranty")}</Button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">{t("seller")}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Gestiona las solicitudes de garantía de tus clientes y mantén un registro de todas las garantías
              </p>
              <Link href="/login">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">{t("login")}</Button>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">{t("admin")}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Administra usuarios, visualiza estadísticas y supervisa todo el sistema de garantías
              </p>
              <Link href="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">{t("login")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2023 Sistema de Garantías. Todos los derechos reservados.</p>
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* For Customers */}
          <div className="bg-gray-900/20 backdrop-blur-lg border border-blue-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">For Customers</h2>
            <p className="text-white/80 mb-8">
              Complete the warranty form for your product and receive updates about the status of your request.
                </p>
            <button
              onClick={handleWarrantyForm}
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
                    Request Warranty
            </button>
              </div>
              
          {/* For Sellers/Admins */}
          <div className="bg-gray-900/20 backdrop-blur-lg border border-yellow-500/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
              {user ? 'Access Your Dashboard' : 'For Sellers & Admins'}
            </h2>
            <p className="text-white/80 mb-8">
              {user 
                ? 'Manage warranty requests, update their status, and generate PDF documents.'
                : 'Sign in to manage warranty requests, update their status, and generate PDF documents.'}
                </p>
            <button
              onClick={user ? handleDashboard : handleLogin}
              className="w-full bg-gradient-to-r from-yellow-500 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>

        <footer className="text-center mt-16 text-white/60">
          <p>© 2024 Warranty Management System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
