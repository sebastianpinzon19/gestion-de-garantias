"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SellerLayout } from "../../shared/layouts/SellerLayout"
import { useAuth } from "@/providers/auth-provider"

export default function Layout({ children }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "seller")) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!user || user.role !== "seller") {
    return null
  }

  return <SellerLayout>{children}</SellerLayout>
}


