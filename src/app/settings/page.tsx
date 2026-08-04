import { AppShell } from "@/components/layout/app-shell";
import { AccountSettings } from "@/components/settings/account-settings";

export default function SettingsPage() {
  return (
    <AppShell>
      <AccountSettings />
    </AppShell>
  );
}
