import { NextResponse } from "next/server";

import { isFirebaseAdminConfigured } from "@/lib/firebase/admin-config";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "TienDiDau",
      version: "1.1.2",
      phase: "auth-bootstrap",
      firebaseClientConfigured: isFirebaseClientConfigured,
      firebaseAdminConfigured: isFirebaseAdminConfigured,
      authBootstrapEndpoint: "/api/auth/bootstrap",
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
