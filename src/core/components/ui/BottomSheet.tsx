"use client";

import {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
  PointerEvent,
} from "react";
import { createPortal } from "react-dom";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

function BottomSheet({
  open,
  onClose,
  title,
  children,
  className = "",
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Drag-to-close state
  const dragStartY = useRef<number | null>(null);
  const currentTranslateY = useRef(0);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  useEffect(() => {
    if (open && sheetRef.current) {
      sheetRef.current.focus();
    }
    if (!open && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [open]);

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

      if (e.key === "Tab" && sheetRef.current) {
        const focusableSelectors =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
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

  // Swipe-to-close handlers
  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = e.clientY;
    currentTranslateY.current = 0;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (dragStartY.current === null) return;
      const delta = e.clientY - dragStartY.current;
      if (delta < 0) return; // Pas de glissement vers le haut
      currentTranslateY.current = delta;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${delta}px)`;
        sheetRef.current.style.transition = "none";
      }
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    if (dragStartY.current === null) return;
    dragStartY.current = null;

    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
      if (currentTranslateY.current > 120) {
        onClose();
      } else {
        sheetRef.current.style.transform = "";
      }
    }
    currentTranslateY.current = 0;
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={[
          "relative z-10 w-full",
          "bg-card border-t border-card-border",
          "rounded-t-[20px]",
          "flex flex-col max-h-[90dvh]",
          "animate-in slide-in-from-bottom duration-300",
          "focus:outline-none",
          className,
        ].join(" ")}
      >
        {/* Drag handle + header */}
        <div
          className="cursor-grab active:cursor-grabbing touch-none shrink-0"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Handle visuel */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-card-border" />
          </div>

          {title && (
            <div className="flex items-center justify-between px-6 pb-4 pt-2">
              <h2
                id="bottom-sheet-title"
                className="text-lg font-semibold text-foreground font-display"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className={[
                  "flex items-center justify-center",
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
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 pb-6 flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export { BottomSheet };
