"use client"

import { useState } from "react"
import { Header } from "./header"
import { CaseForm } from "./case-form"
import { LegalOpinionResult } from "./legal-opinion-result"
import { LanguageProvider } from "@/contexts/language-context"

export function JudgeDashboard() {
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewCase = () => {
    setResult(null)
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {result ? (
            <LegalOpinionResult result={result} onNewCase={handleNewCase} />
          ) : (
            <CaseForm onResult={setResult} isLoading={isLoading} setIsLoading={setIsLoading} />
          )}
        </main>
      </div>
    </LanguageProvider>
  )
}
