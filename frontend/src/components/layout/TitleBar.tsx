import { Sparkles } from "lucide-react";

export function TitleBar() {
  return (
    <div className="h-9 bg-clara-bg/90 backdrop-blur-md border-b border-clara-border/30 flex items-center px-4 select-none draggable">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-clara-accent" />
        <span className="text-sm font-semibold gradient-text">Clara</span>
        <span className="text-xs text-clara-text-muted">AI Browser</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1 no-drag">
        <div className="w-3 h-3 rounded-full bg-clara-success/60 hover:bg-clara-success transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-clara-warning/60 hover:bg-clara-warning transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-clara-error/60 hover:bg-clara-error transition-colors cursor-pointer" />
      </div>
    </div>
  );
}
