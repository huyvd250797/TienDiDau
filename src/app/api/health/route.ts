import { NextResponse } from "next/server";

import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    status: "ok",
    app: "TienDiDau",
    version: "1.0.0",
    phase: "foundation",
    firebaseClientConfigured: isFirebaseClientConfigured,
    timestamp: new Date().toISOString()
  });
}
