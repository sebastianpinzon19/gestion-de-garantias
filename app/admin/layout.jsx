"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, BarChart2, Settings, FileText, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/providers/auth-provider"
import LanguageSwitcher from "@/components/language-switcher"
import ThemeSwitcher from "@/components/theme-switcher"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-yellow-500 text-white shadow-md">
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
                  <p className="text-sm text-gray-400">{t("admin")}</p>
                </div>
                <nav className="py-4">
                  <MobileNavItems t={t} />
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/admin/dashboard">
              <h1 className="text-xl font-bold ml-2 md:ml-0">{t("adminPanel")}</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <span className="hidden md:inline-block text-sm">
              {t("welcome")}, {user?.name || t("admin")}
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

        <main className="flex-1 bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-200">{children}</main>
      </div>
    </div>
  )
}

function DesktopNavItems({ t }) {
  return (
    <>
      <Link href="/admin/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <BarChart2 className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/admin/users">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <Users className="h-5 w-5 mr-3" />
          <span>{t("users")}</span>
        </div>
      </Link>

      <Link href="/admin/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/admin/settings">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <Settings className="h-5 w-5 mr-3" />
          <span>{t("settings")}</span>
        </div>
      </Link>
    </>
  )
}

function MobileNavItems({ t }) {
  return (
    <>
      <Link href="/admin/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <BarChart2 className="h-5 w-5 mr-3" />
          <span>{t("dashboard")}</span>
        </div>
      </Link>

      <Link href="/admin/users">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Users className="h-5 w-5 mr-3" />
          <span>{t("users")}</span>
        </div>
      </Link>

      <Link href="/admin/garantias">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>{t("warranties")}</span>
        </div>
      </Link>

      <Link href="/admin/settings">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Settings className="h-5 w-5 mr-3" />
          <span>{t("settings")}</span>
        </div>
      </Link>
    </>
  )
}

