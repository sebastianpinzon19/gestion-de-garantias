"use client"

import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 bg-yellow-500/20 text-white hover:bg-yellow-500/30 border-yellow-400/40 dark:bg-yellow-800/50 dark:hover:bg-yellow-700"
    >
      <Globe className="h-4 w-4" />
      <span>{language === "es" ? "EN" : "ES"}</span>
    </Button>
  )
}

