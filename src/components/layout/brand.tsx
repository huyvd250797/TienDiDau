import { Icon } from "@/components/ui/icons";

export function Brand({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(124,92,255,0.28)]">
        <Icon name="trend" className="size-5" />
      </span>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold tracking-tight text-foreground">Tiền Đi Đâu</p>
          <p className="truncate text-xs text-muted-foreground">Quản lý thu chi cá nhân</p>
        </div>
      )}
    </div>
  );
}
