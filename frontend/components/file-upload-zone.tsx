"use client";

import type React from "react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  label: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  showPreview?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function FileUploadZone({
  label,
  accept,
  file,
  onFileChange,
  showPreview = false,
}: FileUploadZoneProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && showPreview && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file, showPreview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        if (selectedFile.size > MAX_FILE_SIZE) {
          toast({
            title: t("errorOccurred"),
            description: t("fileTooLarge"),
            variant: "destructive",
          });
          return;
        }
        onFileChange(selectedFile);
      }
    },
    [onFileChange, toast, t]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: accept.includes("image")
        ? { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }
        : {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
          },
      maxFiles: 1,
      maxSize: MAX_FILE_SIZE,
    });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div
        {...getRootProps()}
        className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center gap-3 w-full">
            {previewUrl ? (
              <div className="relative h-16 w-16 rounded-md overflow-hidden border border-border flex-shrink-0">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : file.type.startsWith("image/") ? (
              <ImageIcon className="h-10 w-10 text-primary flex-shrink-0" />
            ) : (
              <File className="h-10 w-10 text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              {t("dragDrop")}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">Max 10MB</p>
          </>
        )}
      </div>
      {fileRejections.length > 0 && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{t("fileTooLarge")}</span>
        </div>
      )}
    </div>
  );
}
