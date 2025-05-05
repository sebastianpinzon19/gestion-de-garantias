<<<<<<< HEAD
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon // Importar el icono de perfil
} from '@heroicons/react/24/outline';

const defaultMenuItems = [
  { id: 'menu_1', name: 'Dashboard', link: '/admin/dashboard', icon: 'home', order: 1 },
  { id: 'menu_2', name: 'Users', link: '/admin/users', icon: 'users', order: 2 },
  { id: 'menu_3', name: 'Warranties', link: '/admin/warranties', icon: 'warranty', order: 3 },
  { id: 'menu_4', name: 'Reports', link: '/admin/reports', icon: 'analytics', order: 4 },
  { id: 'menu_profile', name: 'Profile', link: '/profile', icon: 'profile', order: 5 }, // Añadir enlace de perfil
];

const iconMap = {
  'home': HomeIcon,
  'users': UserGroupIcon,
  'warranty': ShieldCheckIcon,
  'analytics': ChartBarIcon,
  'settings': CogIcon,
  'documents': DocumentTextIcon,
  'profile': UserCircleIcon, // Mapear el icono de perfil
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuItems] = useState(defaultMenuItems);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Set active item based on current path
    const path = window.location.pathname;
    const currentItem = menuItems.find(item => item.link === path);
    setActiveItem(currentItem?.id);
  }, [menuItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              Admin Panel
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = iconMap[item.icon] || ShieldCheckIcon;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.link)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer - Logout movido a la página de perfil */}
          {/* <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div> */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
=======
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
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
