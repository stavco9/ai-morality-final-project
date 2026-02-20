"use client";

import type React from "react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, ImageIcon, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

interface BaseProps {
  label: string;
  accept: string;
  showPreview?: boolean;
}

interface SingleFileProps extends BaseProps {
  multiple?: false;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

interface MultiFileProps extends BaseProps {
  multiple: true;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

type FileUploadZoneProps = SingleFileProps | MultiFileProps;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getAcceptMap(accept: string): Record<string, string[]> {
  if (accept.includes("evidence")) {
    return {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    };
  }
  if (accept.includes("image")) {
    return { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] };
  }
  return {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  };
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isDuplicateFile(existing: File[], candidate: File): boolean {
  return existing.some(
    (f) => f.name === candidate.name && f.size === candidate.size
  );
}

export function FileUploadZone(props: FileUploadZoneProps) {
  const { label, accept, showPreview = false } = props;
  const isMultiple = props.multiple === true;

  const currentFiles = isMultiple ? (props as MultiFileProps).files : [];
  const onFilesChange = isMultiple
    ? (props as MultiFileProps).onFilesChange
    : undefined;
  const onFileChange = !isMultiple
    ? (props as SingleFileProps).onFileChange
    : undefined;

  const { t } = useLanguage();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const singleFile = !isMultiple ? (props as SingleFileProps).file : null;

  useEffect(() => {
    if (singleFile && showPreview && singleFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(singleFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [singleFile, showPreview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const oversized = acceptedFiles.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversized.length > 0) {
        toast({
          title: t("errorOccurred"),
          description: t("fileTooLarge"),
          variant: "destructive",
        });
      }

      const valid = acceptedFiles.filter((f) => f.size <= MAX_FILE_SIZE);
      if (valid.length === 0) return;

      if (isMultiple && onFilesChange) {
        const newFiles = valid.filter(
          (f) => !isDuplicateFile(currentFiles, f)
        );
        if (newFiles.length > 0) {
          onFilesChange([...currentFiles, ...newFiles]);
        }
      } else if (onFileChange) {
        onFileChange(valid[0]);
      }
    },
    [isMultiple, currentFiles, onFilesChange, onFileChange, toast, t]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: getAcceptMap(accept),
      maxFiles: isMultiple ? undefined : 1,
      maxSize: MAX_FILE_SIZE,
      multiple: isMultiple,
    });

  const removeFile = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    if (isMultiple && index !== undefined && onFilesChange) {
      onFilesChange(currentFiles.filter((_, i) => i !== index));
    } else if (!isMultiple && onFileChange) {
      onFileChange(null);
    }
  };

  const renderFileItem = (file: File, index?: number) => (
    <div key={index ?? 0} className="flex items-center gap-3 w-full">
      {previewUrl && !isMultiple ? (
        <div className="relative h-16 w-16 rounded-md overflow-hidden border border-border flex-shrink-0">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      ) : file.type.startsWith("image/") ? (
        <ImageIcon className="h-8 w-8 text-primary flex-shrink-0" />
      ) : (
        <File className="h-8 w-8 text-primary flex-shrink-0" />
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
        onClick={(e) => removeFile(e, index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const dropZonePlaceholder = (
    <>
      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground text-center">
        {t("dragDrop")}
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">Max 10MB</p>
    </>
  );

  if (isMultiple) {
    const hasFiles = currentFiles.length > 0;
    const fileCount = currentFiles.length;

    return (
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {hasFiles && (
            <p className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
              {t("filesSelected").replace("{count}", String(fileCount))}
            </p>
          )}
        </div>

        <div
          {...getRootProps()}
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          {hasFiles ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {currentFiles.map((file, i) => renderFileItem(file, i))}
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-border/50">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("addMoreFiles")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[68px] flex-col items-center justify-center">
              {dropZonePlaceholder}
            </div>
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
        {singleFile ? renderFileItem(singleFile) : dropZonePlaceholder}
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
