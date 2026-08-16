import { requirePageSession } from "@/lib/auth";
import AppShell from "@/components/AppShell";
export default async function ProtectedLayout({children}:{children:React.ReactNode}){await requirePageSession();return <AppShell>{children}</AppShell>}
