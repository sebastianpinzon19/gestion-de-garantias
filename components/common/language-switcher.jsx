"use client"

import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-yellow-500/20 text-white hover:bg-yellow-500/30 border-yellow-400/40 dark:bg-yellow-800/50 dark:hover:bg-yellow-700"
        >
          <Globe className="h-4 w-4" />
          <span>{language === "es" ? "ES" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage("es")}
          className={language === "es" ? "bg-blue-50 dark:bg-blue-900" : ""}
        >
          Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-blue-50 dark:bg-blue-900" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
