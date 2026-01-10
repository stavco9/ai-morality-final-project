"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Scale,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  FileText,
  Gavel,
} from "lucide-react"
import { useLanguage, isHebrewText } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import type { VerdictResponse } from "@/lib/types"

interface LegalOpinionResultProps {
  result: VerdictResponse
  onNewCase: () => void
}

export function LegalOpinionResult({ result, onNewCase }: LegalOpinionResultProps) {
  const { t, isRTL } = useLanguage()
  const { toast } = useToast()
  const [isReasoningOpen, setIsReasoningOpen] = useState(false)

  const contentIsHebrew = isHebrewText(result.decision)
  const textDir = contentIsHebrew ? "rtl" : "ltr"

  const handleCopy = async () => {
    const formattedText = `
${t("verdict").toUpperCase()}
${"=".repeat(50)}

${result.decision}

${t("winner")}: ${result.winner}
${t("loser")}: ${result.loser}

${t("caseSummary").toUpperCase()}
${"-".repeat(30)}
${result.summary}

${t("legalReasoning").toUpperCase()}
${"-".repeat(30)}
${result.reasoning}
    `.trim()

    await navigator.clipboard.writeText(formattedText)
    toast({
      title: t("copied"),
      description: "",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <Gavel className="h-5 w-5 text-primary" />
            </div>
            {t("verdict")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            dir={textDir}
            className="text-lg md:text-xl font-medium text-foreground leading-relaxed text-balance"
            style={{ textAlign: contentIsHebrew ? "right" : "left" }}
          >
            {result.decision}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Winner Card */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div dir={textDir} style={{ textAlign: contentIsHebrew ? "right" : "left" }}>
                <p className="text-sm font-medium text-muted-foreground">{t("winner")}</p>
                <p className="text-lg font-semibold text-green-600">{result.winner}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loser Card */}
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div dir={textDir} style={{ textAlign: contentIsHebrew ? "right" : "left" }}>
                <p className="text-sm font-medium text-muted-foreground">{t("loser")}</p>
                <p className="text-lg font-semibold text-red-500">{result.loser}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("caseSummary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            dir={textDir}
            className="text-muted-foreground leading-relaxed"
            style={{ textAlign: contentIsHebrew ? "right" : "left" }}
          >
            {result.summary}
          </p>
        </CardContent>
      </Card>

      <Card className="print:break-inside-avoid">
        <Collapsible open={isReasoningOpen} onOpenChange={setIsReasoningOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  {t("legalReasoning")}
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  {isReasoningOpen ? (
                    <>
                      {t("hideReasoning")}
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {t("viewReasoning")}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div
                dir={textDir}
                className="prose prose-sm max-w-none dark:prose-invert"
                style={{ textAlign: contentIsHebrew ? "right" : "left" }}
              >
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed border-s-2 border-primary/20 ps-4">
                  {result.reasoning}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Button onClick={handleCopy} variant="outline" size="lg" className="flex-1 bg-transparent">
          <Copy className="h-4 w-4 me-2" />
          {t("copyToClipboard")}
        </Button>
        <Button onClick={handlePrint} variant="outline" size="lg" className="flex-1 bg-transparent">
          <Printer className="h-4 w-4 me-2" />
          {t("print")}
        </Button>
        <Button onClick={onNewCase} size="lg" className="flex-1">
          <RotateCcw className="h-4 w-4 me-2" />
          {t("newCase")}
        </Button>
      </div>
    </div>
  )
}
