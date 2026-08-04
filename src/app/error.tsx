"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-center text-foreground">
      <div className="max-w-md">
        <p className="text-sm font-semibold text-expense">Đã xảy ra lỗi</p>
        <h1 className="mt-3 text-3xl font-bold">Không thể tải màn hình</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Dữ liệu của bạn chưa bị thay đổi. Hãy thử tải lại phần nội dung này.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
