import { Brand } from "@/components/layout/brand";

interface AuthLoadingScreenProps {
  message?: string;
}

export function AuthLoadingScreen({ message = "Đang kiểm tra phiên đăng nhập…" }: AuthLoadingScreenProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center text-center">
        <Brand />
        <div className="mt-10 size-11 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-5 text-sm font-medium text-foreground">{message}</p>
        <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
          Dữ liệu tài chính được tách riêng theo tài khoản của bạn.
        </p>
      </div>
    </main>
  );
}
