import type { CSSProperties } from "react";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-9 text-xs rounded-xl",
  md: "size-11 text-sm rounded-2xl",
  lg: "size-20 text-xl rounded-[1.4rem]"
} as const;

function getInitials(name: string) {
  const normalized = name.trim();
  if (!normalized) return "TĐ";

  return normalized
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toLocaleUpperCase("vi-VN"))
    .join("");
}

export function Avatar({ name, imageUrl, size = "md", className = "" }: AvatarProps) {
  const style: CSSProperties | undefined = imageUrl
    ? {
        backgroundImage: `url(${JSON.stringify(imageUrl).slice(1, -1)})`
      }
    : undefined;

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden bg-linear-to-br from-primary to-indigo-400 bg-cover bg-center font-bold text-white shadow-[0_8px_26px_rgba(124,92,255,0.25)] ${sizeClasses[size]} ${className}`}
      style={style}
    >
      {!imageUrl ? getInitials(name) : null}
    </span>
  );
}
