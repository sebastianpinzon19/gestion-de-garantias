import { GlobalProviders } from "@/providers/global-providers"
import "./globals.css"

export const metadata = {
  title: "Sistema de Garantías",
  description: "Sistema de gestión de garantías para productos",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  )
}
