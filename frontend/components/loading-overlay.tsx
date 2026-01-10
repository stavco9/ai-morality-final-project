"use client";

import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface LoadingOverlayProps {
  phase: "uploading" | "analyzing";
  onCancel: () => void;
}

export function LoadingOverlay({ phase, onCancel }: LoadingOverlayProps) {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Scale className="h-16 w-16 text-primary animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-2 border-primary/30 animate-ping" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">
            {phase === "uploading"
              ? t("uploadingDocuments")
              : t("analyzingCase")}
          </p>
          <p className="text-sm text-muted-foreground">{t("estimatedTime")}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="mt-2 bg-transparent"
        >
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
