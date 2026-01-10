"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LegalOpinionResultProps {
  result: string
  onNewCase: () => void
}

export function LegalOpinionResult({ result, onNewCase }: LegalOpinionResultProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-6 w-6 text-primary" />
            {t("legalOpinion")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{result}</div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onNewCase} variant="outline" size="lg" className="w-full bg-transparent">
        <RotateCcw className="h-4 w-4 me-2" />
        {t("newCase")}
      </Button>
    </div>
  )
}
