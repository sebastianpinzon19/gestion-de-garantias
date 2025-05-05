"use client"

import { AuthProvider } from "./auth-provider"
import { LanguageProvider } from "./language-provider"
import { ThemeProvider } from "./theme-provider"

export function GlobalProviders({ children }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
