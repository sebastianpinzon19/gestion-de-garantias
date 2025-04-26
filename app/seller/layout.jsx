"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SellerLayout } from "@modules/shared/layouts/SellerLayout"
import { useAuth } from "@providers/auth-provider"

export default function Layout({ children }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "seller") {
      router.push("/login")
    }
  }, [router, isAuthenticated, user])

  if (!isAuthenticated || user?.role !== "seller") {
    return null
  }

  return <SellerLayout>{children}</SellerLayout>
} 