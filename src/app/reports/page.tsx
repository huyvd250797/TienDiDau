import { AppShell } from "@/components/layout/app-shell";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export default function ReportsPage() {
  return (
    <AppShell>
      <PhasePlaceholder
        title="Báo cáo"
        description="Theo dõi tổng Thu, tổng Chi, biểu đồ theo ngày và các danh mục chi tiêu lớn nhất trong tháng."
        nextVersion="V1.5.0"
        icon="reports"
      />
    </AppShell>
  );
}
