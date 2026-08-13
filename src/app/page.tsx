import { FinanceDashboard } from "@/components/dashboard/finance-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <FinanceDashboard />
    </AppShell>
  );
}
