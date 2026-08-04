import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";

export default function Page() {
  return (
    <AppShell>
      <section className="surface-card p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Phase tiếp theo</span>
        <h2 className="mt-4 text-2xl font-bold">Ví</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Khung route và responsive layout đã sẵn sàng. Chức năng nghiệp vụ của màn hình này sẽ được phát triển trong giai đoạn tương ứng.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
          Về Dashboard
        </Link>
      </section>
    </AppShell>
  );
}
