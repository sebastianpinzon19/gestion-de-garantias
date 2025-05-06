"use client"

import { ThemeProvider } from "@/context/theme-context"
import { LanguageProvider } from "@/context/language-context"
import { AuthProvider } from "@/providers/auth-provider"

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

