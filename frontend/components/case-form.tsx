"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadZone } from "./file-upload-zone";
import { LoadingOverlay } from "./loading-overlay";
import { useLanguage } from "@/contexts/language-context";
import { FileText, Gavel } from "lucide-react";
import type {
  VerdictResponse,
  FormErrors,
  ApiResponse,
  ApiErrorResponse,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CaseFormProps {
  onResult: (result: VerdictResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function CaseForm({ onResult, isLoading, setIsLoading }: CaseFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [plaintiffName, setPlaintiffName] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimCurrency, setClaimCurrency] = useState("");
  const [claimReason, setClaimReason] = useState("");
  const [plaintiffLetter, setPlaintiffLetter] = useState<File | null>(null);
  const [defendantLetter, setDefendantLetter] = useState<File | null>(null);
  const [plaintiffEvidence, setPlaintiffEvidence] = useState<File | null>(null);
  const [defendantEvidence, setDefendantEvidence] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingPhase, setLoadingPhase] = useState<"uploading" | "analyzing">(
    "uploading"
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!plaintiffName.trim()) {
      newErrors.plaintiffName = t("required");
    }
    if (!defendantName.trim()) {
      newErrors.defendantName = t("required");
    }
    if (!claimAmount.trim()) {
      newErrors.claimAmount = t("required");
    } else if (Number(claimAmount) <= 0 || isNaN(Number(claimAmount))) {
      newErrors.claimAmount = t("invalidAmount");
    }
    if (!claimCurrency) {
      newErrors.claimCurrency = t("required");
    }
    if (!claimReason.trim()) {
      newErrors.claimReason = t("required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid =
    plaintiffName.trim() &&
    defendantName.trim() &&
    claimAmount.trim() &&
    Number(claimAmount) > 0 &&
    claimCurrency &&
    claimReason.trim();

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoadingPhase("uploading");
    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();

      if (plaintiffLetter) {
        formData.append("plaintiff_letter", plaintiffLetter);
      }
      if (defendantLetter) {
        formData.append("defendant_letter", defendantLetter);
      }
      if (plaintiffEvidence) {
        formData.append("image1", plaintiffEvidence);
      }
      if (defendantEvidence) {
        formData.append("image2", defendantEvidence);
      }

      const bodyData = {
        plaintiff: plaintiffName,
        defendant: defendantName,
        claim_amount: Number(claimAmount),
        claim_currency: claimCurrency,
        claim_reason: claimReason,
      };

      formData.append("body", JSON.stringify(bodyData));

      setTimeout(() => {
        setLoadingPhase("analyzing");
      }, 1500);

      const apiUrl = process.env.REACT_APP_API_URL || "https://ai-morality-final-project.k8s.stav-devops.eu-central-1.pre-prod.stavco9.com";
      const response = await fetch(`${apiUrl}/ask/gemini`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new Error(errorData.error || "Failed to get legal opinion");
      }

      const apiResponse = data as ApiResponse;
      onResult(apiResponse.response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Request was cancelled, do nothing
        return;
      }
      console.error("Error:", error);
      toast({
        title: t("errorOccurred"),
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const currencies = [
    { value: "ILS", label: "₪ ILS" },
    { value: "USD", label: "$ USD" },
    { value: "EUR", label: "€ EUR" },
    { value: "GBP", label: "£ GBP" },
  ];

  return (
    <div className="relative space-y-6">
      {isLoading && (
        <LoadingOverlay phase={loadingPhase} onCancel={handleCancel} />
      )}

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
                onChange={(e) => {
                  setPlaintiffName(e.target.value);
                  if (errors.plaintiffName)
                    setErrors((prev) => ({
                      ...prev,
                      plaintiffName: undefined,
                    }));
                }}
                className={errors.plaintiffName ? "border-destructive" : ""}
              />
              {errors.plaintiffName && (
                <p className="text-sm text-destructive">
                  {errors.plaintiffName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="defendant">{t("defendantName")}</Label>
              <Input
                id="defendant"
                placeholder={t("enterDefendantName")}
                value={defendantName}
                onChange={(e) => {
                  setDefendantName(e.target.value);
                  if (errors.defendantName)
                    setErrors((prev) => ({
                      ...prev,
                      defendantName: undefined,
                    }));
                }}
                className={errors.defendantName ? "border-destructive" : ""}
              />
              {errors.defendantName && (
                <p className="text-sm text-destructive">
                  {errors.defendantName}
                </p>
              )}
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
                onChange={(e) => {
                  setClaimAmount(e.target.value);
                  if (errors.claimAmount)
                    setErrors((prev) => ({ ...prev, claimAmount: undefined }));
                }}
                className={errors.claimAmount ? "border-destructive" : ""}
              />
              {errors.claimAmount && (
                <p className="text-sm text-destructive">{errors.claimAmount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">{t("claimCurrency")}</Label>
              <Select
                value={claimCurrency}
                onValueChange={(value) => {
                  setClaimCurrency(value);
                  if (errors.claimCurrency)
                    setErrors((prev) => ({
                      ...prev,
                      claimCurrency: undefined,
                    }));
                }}
              >
                <SelectTrigger
                  id="currency"
                  className={errors.claimCurrency ? "border-destructive" : ""}
                >
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
              {errors.claimCurrency && (
                <p className="text-sm text-destructive">
                  {errors.claimCurrency}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">{t("claimReason")}</Label>
            <Textarea
              id="reason"
              placeholder={t("describeReason")}
              value={claimReason}
              onChange={(e) => {
                setClaimReason(e.target.value);
                if (errors.claimReason)
                  setErrors((prev) => ({ ...prev, claimReason: undefined }));
              }}
              className={`min-h-[100px] ${
                errors.claimReason ? "border-destructive" : ""
              }`}
            />
            {errors.claimReason && (
              <p className="text-sm text-destructive">{errors.claimReason}</p>
            )}
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
              <h3 className="font-medium text-foreground border-b border-border pb-2">
                {t("plaintiffDocuments")}
              </h3>
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
                  showPreview
                />
              </div>
            </div>

            {/* Defendant Documents */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground border-b border-border pb-2">
                {t("defendantDocuments")}
              </h3>
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
                  showPreview
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button - Added disabled state based on form validity */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !isFormValid}
        size="lg"
        className="w-full py-6 text-lg font-semibold"
      >
        <Gavel className="h-5 w-5 me-2" />
        {t("createOpinion")}
      </Button>
    </div>
  );
}
