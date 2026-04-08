"use client"

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react"

export interface UploadResult {
  url: string
  width: number
  height: number
  size: number
}

export interface FileUploadProps {
  onUpload: (result: UploadResult) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
}

type UploadState =
  | { status: "idle" }
  | { status: "dragging" }
  | { status: "previewing"; previewUrl: string; file: File }
  | { status: "uploading"; previewUrl: string; progress: number }
  | { status: "done"; result: UploadResult }
  | { status: "error"; message: string }

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif"
const DEFAULT_MAX_SIZE_MB = 10

export function FileUpload({
  onUpload,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE_MB * 1024 * 1024,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>({ status: "idle" })

  const reset = useCallback(() => {
    if (
      state.status === "previewing" ||
      state.status === "uploading"
    ) {
      URL.revokeObjectURL(
        (state as { status: string; previewUrl: string }).previewUrl
      )
    }
    setState({ status: "idle" })
    if (inputRef.current) inputRef.current.value = ""
  }, [state])

  const handleFile = useCallback(
    (file: File) => {
      const acceptedTypes = accept.split(",").map((t) => t.trim())
      if (!acceptedTypes.includes(file.type)) {
        setState({
          status: "error",
          message: "Type de fichier non accepté. Formats supportés : JPEG, PNG, WebP, GIF",
        })
        return
      }

      if (file.size > maxSize) {
        const maxMb = Math.round(maxSize / (1024 * 1024))
        setState({
          status: "error",
          message: `Le fichier dépasse la taille maximale (${maxMb} MB)`,
        })
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setState({ status: "previewing", previewUrl, file })
    },
    [accept, maxSize]
  )

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled && state.status === "idle") {
        setState({ status: "dragging" })
      }
    },
    [disabled, state.status]
  )

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (state.status === "dragging") {
        setState({ status: "idle" })
      }
    },
    [state.status]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [disabled, handleFile]
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleUpload = useCallback(async () => {
    if (state.status !== "previewing") return
    const { file, previewUrl } = state

    setState({ status: "uploading", previewUrl, progress: 0 })

    const formData = new FormData()
    formData.append("file", file)

    // Use XMLHttpRequest for progress tracking
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload")

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setState((prev) =>
            prev.status === "uploading" ? { ...prev, progress } : prev
          )
        }
      })

      xhr.addEventListener("load", () => {
        URL.revokeObjectURL(previewUrl)
        if (xhr.status === 201) {
          let parsed: { data: UploadResult }
          try {
            parsed = JSON.parse(xhr.responseText) as { data: UploadResult }
          } catch {
            setState({
              status: "error",
              message: "Réponse serveur invalide",
            })
            reject(new Error("invalid response"))
            return
          }
          setState({ status: "done", result: parsed.data })
          onUpload(parsed.data)
          resolve()
        } else {
          let message = "Erreur lors de l'upload"
          try {
            const errBody = JSON.parse(xhr.responseText) as {
              error?: { message?: string }
            }
            if (errBody.error?.message) message = errBody.error.message
          } catch {
            // keep default message
          }
          setState({ status: "error", message })
          reject(new Error(message))
        }
      })

      xhr.addEventListener("error", () => {
        URL.revokeObjectURL(previewUrl)
        setState({
          status: "error",
          message: "Erreur réseau lors de l'upload",
        })
        reject(new Error("network error"))
      })

      xhr.send(formData)
    }).catch(() => {
      // errors are handled via setState above
    })
  }, [state, onUpload])

  const isDragging = state.status === "dragging"
  const isDisabled =
    disabled || state.status === "uploading"
  const hasPreview =
    state.status === "previewing" || state.status === "uploading"
  const previewUrl = hasPreview
    ? (state as { previewUrl: string }).previewUrl
    : state.status === "done"
    ? state.result.url
    : null

  return (
    <div className={["flex flex-col gap-3", className].join(" ")}>
      {/* Drop zone */}
      {(state.status === "idle" ||
        state.status === "dragging" ||
        state.status === "error") && (
        <div
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label="Zone de dépôt de fichier"
          aria-disabled={isDisabled}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isDisabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
              inputRef.current?.click()
            }
          }}
          className={[
            "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2",
            "rounded-card border-2 border-dashed px-4 py-6 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isDragging
              ? "border-primary bg-primary/10 text-primary"
              : "border-card-border bg-card text-foreground-muted hover:border-primary hover:text-primary",
            isDisabled ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
        >
          <UploadIcon className="h-8 w-8 shrink-0" aria-hidden />
          <p className="text-center text-sm">
            {isDragging ? (
              "Déposez le fichier ici"
            ) : (
              <>
                <span className="font-medium text-primary">
                  Cliquez pour choisir
                </span>{" "}
                ou glissez-déposez
              </>
            )}
          </p>
          <p className="text-xs text-foreground-muted">
            JPEG, PNG, WebP, GIF — max{" "}
            {Math.round(maxSize / (1024 * 1024))} MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleInputChange}
        disabled={isDisabled}
      />

      {/* Error */}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-500 dark:text-red-400">
          {state.message}
        </p>
      )}

      {/* Preview */}
      {(hasPreview || state.status === "done") && previewUrl && (
        <div className="relative overflow-hidden rounded-card border border-card-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Aperçu"
            className="max-h-64 w-full object-contain"
          />

          {/* Progress overlay */}
          {state.status === "uploading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
              <div
                role="progressbar"
                aria-valuenow={state.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progression de l'upload"
                className="w-2/3"
              >
                <div className="h-2 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-center text-xs text-white">
                  {state.progress}%
                </p>
              </div>
            </div>
          )}

          {/* Done badge */}
          {state.status === "done" && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow">
              <CheckIcon className="h-3 w-3" aria-hidden />
              Uploadé
            </div>
          )}
        </div>
      )}

      {/* Action buttons when previewing */}
      {state.status === "previewing" && (
        <div className="flex min-h-[44px] gap-2">
          <button
            type="button"
            onClick={handleUpload}
            className={[
              "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn",
              "bg-primary px-4 text-sm font-medium text-primary-foreground",
              "transition-opacity hover:opacity-90 active:opacity-80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            ].join(" ")}
          >
            Uploader
          </button>
          <button
            type="button"
            onClick={reset}
            className={[
              "inline-flex h-11 min-w-[44px] items-center justify-center rounded-btn",
              "border border-card-border bg-card px-4 text-sm text-foreground",
              "transition-colors hover:bg-card/80 active:bg-card/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            ].join(" ")}
            aria-label="Annuler"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Reset button after done */}
      {state.status === "done" && (
        <button
          type="button"
          onClick={reset}
          className={[
            "inline-flex h-11 items-center justify-center gap-2 rounded-btn",
            "border border-card-border bg-card px-4 text-sm text-foreground",
            "transition-colors hover:bg-card/80 active:bg-card/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          ].join(" ")}
        >
          Choisir un autre fichier
        </button>
      )}
    </div>
  )
}

// ── Inline SVG icons (no external dependency) ─────────────────────────────────

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
      <polyline points="12 3 12 15" />
      <polyline points="7 8 12 3 17 8" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
