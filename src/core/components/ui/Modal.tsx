"use client";

import {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Sauvegarde le focus actuel avant ouverture
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Focus le dialog à l'ouverture, retour au focus précédent à la fermeture
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
    if (!open && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [open]);

  // Verrou du scroll body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableSelectors =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[
          "relative z-10 w-full max-w-lg",
          "bg-card border border-card-border rounded-modal shadow-card",
          "flex flex-col max-h-[90dvh]",
          "focus:outline-none",
          className,
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-card-border shrink-0">
          {title && (
            <h2
              id="modal-title"
              className="text-lg font-semibold text-foreground font-display"
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className={[
              "ml-auto flex items-center justify-center",
              "w-8 h-8 rounded-full text-foreground-muted",
              "hover:bg-card-border hover:text-foreground",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export { Modal };
