import { AppShell } from "@/components/layout/app-shell";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export default function TransactionsPage() {
  return (
    <AppShell>
      <PhasePlaceholder
        title="Giao dịch"
        description="Ghi nhận Thu, Chi, Chuyển tiền, sửa và xóa giao dịch với cơ chế tự động hoàn tác số dư."
        nextVersion="V1.3.0"
        icon="transactions"
      />
    </AppShell>
  );
}
