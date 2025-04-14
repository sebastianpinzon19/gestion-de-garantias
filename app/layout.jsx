import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/context/theme-context"
import { AuthProvider } from "@/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Warranty Management System | GarantíasApp",
  description: "Efficient digital platform for managing product warranties",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}