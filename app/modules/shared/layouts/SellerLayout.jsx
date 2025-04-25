"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, History, Home, LogOut, Menu, PlusCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "@/components/theme-switcher.jsx"
import Image from "next/image"
import { useAuth } from "@/providers/auth-provider"

export function SellerLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gray-900 text-white">
                <div className="py-6 px-4 border-b border-gray-800">
                  <h2 className="text-xl font-bold">Warranty System</h2>
                  <p className="text-sm text-gray-400">Seller Portal</p>
                </div>
                <nav className="py-4">
                  <MobileNavItems />
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/seller/dashboard">
              <Image
                src="/logo empresa.png"
                alt="Company Logo"
                width={150}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <span className="hidden md:inline-block text-sm">
              Welcome, {user?.name || "Seller"}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-900 text-white">
          <nav className="py-6 px-4 space-y-1">
            <DesktopNavItems />
          </nav>
        </aside>

        <main className="flex-1 bg-gray-50 dark:bg-gray-800 p-6">{children}</main>
      </div>
    </div>
  )
}

function DesktopNavItems() {
  return (
    <>
      <Link href="/seller/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </div>
      </Link>

      <Link href="/seller/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>Warranties</span>
        </div>
      </Link>

      <Link href="/seller/warranties/new">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>New Warranty</span>
        </div>
      </Link>

      <Link href="/seller/warranties/history">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
          <History className="h-5 w-5 mr-3" />
          <span>History</span>
        </div>
      </Link>
    </>
  )
}

function MobileNavItems() {
  return (
    <>
      <Link href="/seller/dashboard">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </div>
      </Link>

      <Link href="/seller/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>Warranties</span>
        </div>
      </Link>

      <Link href="/seller/warranties/new">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <PlusCircle className="h-5 w-5 mr-3" />
          <span>New Warranty</span>
        </div>
      </Link>

      <Link href="/seller/warranties/history">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <History className="h-5 w-5 mr-3" />
          <span>History</span>
        </div>
      </Link>
    </>
  )
} 