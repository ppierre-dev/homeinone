"use client";

import { ImgHTMLAttributes, useState } from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

/**
 * Génère une couleur HSL déterministe depuis une chaîne de caractères.
 * Garantit un contraste correct avec du texte blanc.
 */
function colorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 38%)`;
}

/**
 * Extrait les initiales depuis un nom (jusqu'à 2 caractères).
 * Ex: "Marie Dupont" → "MD", "Alice" → "A"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const displayName = fallback ?? alt;
  const initials = getInitials(displayName);
  const bgColor = colorFromString(displayName);
  const showImage = !!src && !imgError;

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-full overflow-hidden shrink-0",
        "select-none font-medium",
        sizeClasses[size],
        className,
      ].join(" ")}
      style={!showImage ? { backgroundColor: bgColor, color: "#ffffff" } : undefined}
      aria-label={alt}
      role="img"
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          {...props}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}

export { Avatar };
