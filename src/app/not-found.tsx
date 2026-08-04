import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center text-foreground">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold">Trang chưa được xây dựng</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Phase 1 mới khởi tạo nền tảng. Các module nghiệp vụ sẽ được bổ sung ở những giai đoạn tiếp theo.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Về Dashboard
        </Link>
      </div>
    </main>
  );
}
