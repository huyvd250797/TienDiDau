export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background text-foreground">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Đang tải Tiền Đi Đâu…</p>
      </div>
    </div>
  );
}
