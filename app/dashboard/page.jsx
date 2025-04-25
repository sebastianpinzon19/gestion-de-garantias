"use client"

import { useAuth } from "@/modules/shared/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    // Redirigir según el rol
    if (user.role === "admin") {
      router.replace("/admin/dashboard")
    } else if (user.role === "seller") {
      router.replace("/seller/dashboard")
    }
  }, [isAuthenticated, user, router])

  // Este componente no renderiza nada ya que solo sirve como redirección
  return null
} 