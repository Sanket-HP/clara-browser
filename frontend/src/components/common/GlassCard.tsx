import { clsx } from "clsx";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "glass rounded-xl p-4",
        glow && "glow-border animate-glow-pulse",
        onClick && "cursor-pointer hover:bg-clara-card/80 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
