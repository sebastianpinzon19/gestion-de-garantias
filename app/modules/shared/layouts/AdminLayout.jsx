"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, History, Home, LogOut, Menu, PlusCircle, ListTodo } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "@/components/theme-switcher"
import { useAuth } from "@/providers/auth-provider"
import Image from "next/image"

export function AdminLayout({ children }) {
  const { user, logout } = useAuth()

  const DesktopNavItems = () => (
    <div className="hidden md:flex items-center gap-4">
      <Link href="/admin/dashboard">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-700">
          Dashboard
        </Button>
      </Link>
      <Link href="/admin/warranties">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-700">
          Warranties
        </Button>
      </Link>
      <Link href="/admin/sellers">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-700">
          Sellers
        </Button>
      </Link>
    </div>
  )

  const MobileNavItems = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/warranties">
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Warranties
            </Button>
          </Link>
          <Link href="/admin/sellers">
            <Button variant="ghost" className="w-full justify-start">
              <ListTodo className="mr-2 h-4 w-4" />
              Sellers
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
            <DesktopNavItems />
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm">Welcome, {user?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-blue-700"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <MobileNavItems />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 