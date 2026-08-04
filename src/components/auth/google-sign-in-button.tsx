"use client";

import { useAuth } from "@/components/providers/auth-provider";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.64-2.43l-3.24-2.53c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.87A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.87V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.61Z" />
      <path fill="#EA4335" d="M12 6c1.47 0 2.79.5 3.83 1.5l2.88-2.88C16.97 3 14.7 2 12 2a10 10 0 0 0-8.96 5.52l3.35 2.61C7.18 7.76 9.39 6 12 6Z" />
    </svg>
  );
}

export function GoogleSignInButton() {
  const { status, signInWithGoogle } = useAuth();
  const loading = status === "authenticating" || status === "bootstrapping";

  return (
    <button
      type="button"
      onClick={() => void signInWithGoogle()}
      disabled={loading}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-[#172033] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
    >
      {loading ? (
        <span className="size-5 animate-spin rounded-full border-2 border-[#172033]/20 border-t-[#172033]" />
      ) : (
        <GoogleLogo />
      )}
      {loading ? "Đang đăng nhập…" : "Tiếp tục với Google"}
    </button>
  );
}
