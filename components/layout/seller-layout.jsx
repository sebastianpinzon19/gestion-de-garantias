"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FileText, History, Home, LogOut, Menu, PlusCircle } from "lucide-react"
import ThemeSwitcher from "@/components/common/theme-switcher"
import LanguageSwitcher from "@/components/common/language-switcher"
import { useLanguage } from "@/providers/language-provider"
import { useAuth } from "@/providers/auth-provider"

export default function SellerLayout({ children }) {
  const { t } = useLanguage()
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Verificar si el usuario está autenticado y es vendedor
    if (isMounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "seller") {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router, user, isMounted])

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gray-900 text-white">
                <div className="py-6 px-4 border-b border-gray-800">
                  <h2 className="text-xl font-bold">{t("warrantySystem")}</h2>
                  <p className="text-sm text-gray-400">{t("seller")}</p>
                </div>
                <nav className="py-4">
                  <MobileNavItems t={t} />
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/vendedor/dashboard">
              <h1 className="text-xl font-bold ml-2 md:ml-0">{t("warrantySystem")}</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <span className="hidden md:inline-block text-sm">
              {t("welcome")}, {user?.name || t("seller")}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline-block">{t("logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-900 text-white">
          <nav className="py-6 px-4 space-y-1">
            <DesktopNavItems t={t} />
          </nav>
        </aside>

        <main className="flex-1 bg-gray-50 dark:bg-gray-800 p-6">{children}</main>
      </div>
    </div>
  )
}

function DesktopNavItems({ t }) {
  return (
    <>
      <Link href="/vendedor/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias/pendientes">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>{t("pendingWarranties")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias/historial">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <History className="h-5 w-5 mr-3" />
          <span>{t("history")}</span>
        </div>
      </Link>
    </>
  )
}

function MobileNavItems({ t }) {
  return (
    <>
      <Link href="/vendedor/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias/pendientes">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>{t("pendingWarranties")}</span>
        </div>
      </Link>

      <Link href="/vendedor/garantias/historial">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <History className="h-5 w-5 mr-3" />
          <span>{t("history")}</span>
        </div>
      </Link>
    </>
  )
}
