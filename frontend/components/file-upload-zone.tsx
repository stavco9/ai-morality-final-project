"use client"

import type React from "react"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface FileUploadZoneProps {
  label: string
  accept: string
  file: File | null
  onFileChange: (file: File | null) => void
}

export function FileUploadZone({ label, accept, file, onFileChange }: FileUploadZoneProps) {
  const { t } = useLanguage()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.includes("image")
      ? { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }
      : {
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
    maxFiles: 1,
  })

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileChange(null)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div
        {...getRootProps()}
        className={`relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center gap-2">
            <File className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">{t("dragDrop")}</p>
          </>
        )}
      </div>
    </div>
  )
}
