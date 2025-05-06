import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/providers/auth-provider"
import { LanguageProvider } from "@/providers/language-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Warranty Management System",
  description: "Efficiently manage product warranties",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-900 text-gray-100`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
