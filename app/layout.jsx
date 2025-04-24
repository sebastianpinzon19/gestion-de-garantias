import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Providers from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema de Gestión de Garantías",
  description: "Sistema para gestionar garantías de productos",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 