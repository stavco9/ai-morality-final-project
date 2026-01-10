"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploadZone } from "./file-upload-zone"
import { LoadingOverlay } from "./loading-overlay"
import { useLanguage } from "@/contexts/language-context"
import { FileText, Gavel } from "lucide-react"

interface CaseFormProps {
  onResult: (result: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function CaseForm({ onResult, isLoading, setIsLoading }: CaseFormProps) {
  const { t } = useLanguage()
  const [plaintiffName, setPlaintiffName] = useState("")
  const [defendantName, setDefendantName] = useState("")
  const [claimAmount, setClaimAmount] = useState("")
  const [claimCurrency, setClaimCurrency] = useState("")
  const [claimReason, setClaimReason] = useState("")
  const [plaintiffLetter, setPlaintiffLetter] = useState<File | null>(null)
  const [defendantLetter, setDefendantLetter] = useState<File | null>(null)
  const [plaintiffEvidence, setPlaintiffEvidence] = useState<File | null>(null)
  const [defendantEvidence, setDefendantEvidence] = useState<File | null>(null)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const formData = new FormData()

      if (plaintiffLetter) {
        formData.append("plaintiff_letter", plaintiffLetter)
      }
      if (defendantLetter) {
        formData.append("defendant_letter", defendantLetter)
      }
      if (plaintiffEvidence) {
        formData.append("image1", plaintiffEvidence)
      }
      if (defendantEvidence) {
        formData.append("image2", defendantEvidence)
      }

      const bodyData = {
        plaintiff: plaintiffName,
        defendant: defendantName,
        claim_amount: Number(claimAmount),
        claim_currency: claimCurrency,
        claim_reason: claimReason,
      }

      formData.append("body", JSON.stringify(bodyData))

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(
        `${apiUrl}/ask/gemini`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Failed to get legal opinion")
      }

      const data = await response.text()
      onResult(data)
    } catch (error) {
      console.error("Error:", error)
      onResult("An error occurred while processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const currencies = [
    { value: "ILS", label: "₪ ILS" },
    { value: "USD", label: "$ USD" },
    { value: "EUR", label: "€ EUR" },
    { value: "GBP", label: "£ GBP" },
  ]

  return (
    <div className="relative space-y-6">
      {isLoading && <LoadingOverlay />}

      {/* Case Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("caseDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plaintiff">{t("plaintiffName")}</Label>
              <Input
                id="plaintiff"
                placeholder={t("enterPlaintiffName")}
                value={plaintiffName}
                onChange={(e) => setPlaintiffName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defendant">{t("defendantName")}</Label>
              <Input
                id="defendant"
                placeholder={t("enterDefendantName")}
                value={defendantName}
                onChange={(e) => setDefendantName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">{t("claimAmount")}</Label>
              <Input
                id="amount"
                type="number"
                placeholder={t("enterAmount")}
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t("claimCurrency")}</Label>
              <Select value={claimCurrency} onValueChange={setClaimCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">{t("claimReason")}</Label>
            <Textarea
              id="reason"
              placeholder={t("describeReason")}
              value={claimReason}
              onChange={(e) => setClaimReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Evidence Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("documentEvidence")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Plaintiff Documents */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">{t("plaintiffDocuments")}</h3>
              <div className="space-y-3">
                <FileUploadZone
                  label={t("uploadLetter")}
                  accept=".pdf,.doc,.docx"
                  file={plaintiffLetter}
                  onFileChange={setPlaintiffLetter}
                />
                <FileUploadZone
                  label={t("uploadEvidence")}
                  accept="image/*"
                  file={plaintiffEvidence}
                  onFileChange={setPlaintiffEvidence}
                />
              </div>
            </div>

            {/* Defendant Documents */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">{t("defendantDocuments")}</h3>
              <div className="space-y-3">
                <FileUploadZone
                  label={t("uploadLetter")}
                  accept=".pdf,.doc,.docx"
                  file={defendantLetter}
                  onFileChange={setDefendantLetter}
                />
                <FileUploadZone
                  label={t("uploadEvidence")}
                  accept="image/*"
                  file={defendantEvidence}
                  onFileChange={setDefendantEvidence}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Button onClick={handleSubmit} disabled={isLoading} size="lg" className="w-full py-6 text-lg font-semibold">
        <Gavel className="h-5 w-5 me-2" />
        {t("createOpinion")}
      </Button>
    </div>
  )
}
