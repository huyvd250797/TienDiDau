import { Brand } from "@/components/layout/brand";

interface AuthLoadingScreenProps {
  message?: string;
}

export function AuthLoadingScreen({ message = "Đang mở Tiền Đi Đâu…" }: AuthLoadingScreenProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center text-center">
        <Brand />
        <div className="mt-8 size-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-4 text-sm font-medium text-foreground">{message}</p>
        <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
          Không cần đăng nhập. Dữ liệu được nhận diện tự động trên thiết bị này.
        </p>
      </div>
    </main>
  );
}
