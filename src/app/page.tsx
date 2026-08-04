import { AuthBootstrapDashboard } from "@/components/dashboard/auth-bootstrap-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <AuthBootstrapDashboard />
    </AppShell>
  );
}
