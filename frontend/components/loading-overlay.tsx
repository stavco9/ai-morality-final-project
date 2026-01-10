"use client"

import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LoadingOverlay() {
  const { t } = useLanguage()

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">{t("loading")}</p>
      </div>
    </div>
  )
}
