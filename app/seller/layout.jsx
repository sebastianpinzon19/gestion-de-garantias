"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FileText, LogOut, Menu, User } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

export default function SellerLayout({ children }) {
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Check if user is authenticated and is a seller
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-gray-800 text-white">
                <div className="py-6 px-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold">Warranty System</h2>
                  <p className="text-sm text-gray-400">Seller Dashboard</p>
                </div>
                <nav className="py-4">
                  <MobileNavItems />
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/seller/warranties">
              <h1 className="text-xl font-bold ml-2 md:ml-0">Warranty System</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-sm">Welcome, {user?.name || "Seller"}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-800 text-white">
          <nav className="py-6 px-4 space-y-1">
            <DesktopNavItems />
          </nav>
        </aside>

        <main className="flex-1 bg-gray-900 p-6">{children}</main>
      </div>
    </div>
  )
}

function DesktopNavItems() {
  return (
    <>
      <Link href="/seller/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>Warranties</span>
        </div>
      </Link>

      <Link href="/seller/profile">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
          <User className="h-5 w-5 mr-3" />
          <span>My Profile</span>
        </div>
      </Link>
    </>
  )
}

function MobileNavItems() {
  return (
    <>
      <Link href="/seller/warranties">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          <FileText className="h-5 w-5 mr-3" />
          <span>Warranties</span>
        </div>
      </Link>

      <Link href="/seller/profile">
        <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
          <User className="h-5 w-5 mr-3" />
          <span>My Profile</span>
        </div>
      </Link>
    </>
  )
}
