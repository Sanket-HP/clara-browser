import { clsx } from "clsx";
import type { ReactNode, MouseEvent } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  className?: string;
  variant?: "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "p-1 rounded-md",
  md: "p-2 rounded-lg",
  lg: "p-3 rounded-xl",
};

const variantClasses = {
  ghost:
    "text-clara-text-muted hover:text-clara-text hover:bg-clara-card/60 transition-colors",
  accent:
    "text-clara-accent hover:text-white hover:bg-clara-accent/20 transition-colors",
  danger:
    "text-clara-text-muted hover:text-clara-error hover:bg-clara-error/10 transition-colors",
};

export function IconButton({
  children,
  onClick,
  title,
  className,
  variant = "ghost",
  size = "md",
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={clsx(
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
