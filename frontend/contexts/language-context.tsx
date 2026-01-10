"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "he"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: "AI Judicial Assistant",
    caseDetails: "Case Details",
    plaintiffName: "Plaintiff Name",
    defendantName: "Defendant Name",
    claimAmount: "Claim Amount",
    claimCurrency: "Claim Currency",
    claimReason: "Claim Reason",
    documentEvidence: "Document Evidence",
    plaintiffDocuments: "Plaintiff Documents",
    defendantDocuments: "Defendant Documents",
    uploadLetter: "Upload Letter (PDF/DOC)",
    uploadEvidence: "Upload Evidence Images (Optional)",
    createOpinion: "Create Legal Opinion",
    loading: "Analyzing case...",
    legalOpinion: "Legal Opinion",
    newCase: "Start New Case",
    dragDrop: "Drag & drop or click to upload",
    selectCurrency: "Select currency",
    enterPlaintiffName: "Enter plaintiff name",
    enterDefendantName: "Enter defendant name",
    enterAmount: "Enter amount",
    describeReason: "Describe the reason for the claim...",
  },
  he: {
    title: "עוזר שיפוטי מבוסס AI",
    caseDetails: "פרטי התיק",
    plaintiffName: "שם התובע",
    defendantName: "שם הנתבע",
    claimAmount: "סכום התביעה",
    claimCurrency: "מטבע התביעה",
    claimReason: "סיבת התביעה",
    documentEvidence: "ראיות מסמכים",
    plaintiffDocuments: "מסמכי התובע",
    defendantDocuments: "מסמכי הנתבע",
    uploadLetter: "העלה מכתב (PDF/DOC)",
    uploadEvidence: "העלה תמונות ראיה (אופציונלי)",
    createOpinion: "צור חוות דעת",
    loading: "מנתח את התיק...",
    legalOpinion: "חוות דעת משפטית",
    newCase: "התחל תיק חדש",
    dragDrop: "גרור ושחרר או לחץ להעלאה",
    selectCurrency: "בחר מטבע",
    enterPlaintiffName: "הזן שם תובע",
    enterDefendantName: "הזן שם נתבע",
    enterAmount: "הזן סכום",
    describeReason: "תאר את סיבת התביעה...",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const isRTL = language === "he"

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language, isRTL])

  const t = (key: string) => translations[language][key] || key

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
