import { FoundationDashboard } from "@/components/dashboard/foundation-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <FoundationDashboard />
    </AppShell>
  );
}
