"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, History, Home, LogOut, Menu, PlusCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/context/language-context"
import LanguageSwitcher from "@/components/common/language-switcher"
import ThemeSwitcher from "@/components/common/theme-switcher"

export default function DashboardLayout({ children }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          router.push("/login")
          return
        }

        const parsedUser = JSON.parse(userData)
        // Ensure only sellers or admins can access the dashboard
        if (parsedUser.role !== "seller" && parsedUser.role !== "admin") {
          router.push("/login")
          return
        }
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch (error) {
        console.error("Error during logout:", error)
      }
    }
    router.push("/login")
  }

  if (loading) {
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

            <Link href="/dashboard">
              <h1 className="text-xl font-bold ml-2 md:ml-0">{t("warrantySystem")}</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <span className="hidden md:inline-block text-sm">
              {t("welcome")}, {user?.name || t("seller")}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
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
      <Link href="/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias/nuevas">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>{t("pendingWarranties")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias/historial">
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
      <Link href="/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias/nuevas">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>{t("pendingWarranties")}</span>
        </div>
      </Link>

      <Link href="/dashboard/garantias/historial">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <History className="h-5 w-5 mr-3" />
          <span>{t("history")}</span>
        </div>
      </Link>
    </>
  )
}

