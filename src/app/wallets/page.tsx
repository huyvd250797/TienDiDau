import { AppShell } from "@/components/layout/app-shell";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export default function WalletsPage() {
  return (
    <AppShell>
      <PhasePlaceholder
        title="Ví của tôi"
        description="Tạo và quản lý tiền mặt, tài khoản ngân hàng, ví điện tử, thẻ tín dụng cùng số dư ban đầu."
        nextVersion="V1.2.0"
        icon="wallet"
      />
    </AppShell>
  );
}
