import { GlobalProviders } from "@/providers/global-providers"
import "./globals.css"
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Warranty Management System",
  description: "System for managing warranties and technical services",
=======

export const metadata = {
  title: "Sistema de Garantías",
  description: "Sistema de gestión de garantías para productos",
    generator: 'v0.dev'
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
}

export default function RootLayout({ children }) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
=======
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <GlobalProviders>{children}</GlobalProviders>
>>>>>>> 27c886d17fdc627e068ea5188164c1132b8d329f
      </body>
    </html>
  )
}
