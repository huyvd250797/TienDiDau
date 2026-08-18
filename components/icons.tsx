import type { SVGProps } from "react";

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></IconBase>; }
export function WalletIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M4 7.5h15a2 2 0 0 1 2 2V19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M16 12h5"/></IconBase>; }
export function ReceiptIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/></IconBase>; }
export function ChartIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20V8"/></IconBase>; }
export function SettingsIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .35 2l.05.05-2.75 2.75-.05-.05a1.8 1.8 0 0 0-2-.35 1.8 1.8 0 0 0-1.1 1.65V21h-3.9v-.07A1.8 1.8 0 0 0 8.9 19.3a1.8 1.8 0 0 0-2 .35l-.05.05-2.75-2.75.05-.05a1.8 1.8 0 0 0 .35-2A1.8 1.8 0 0 0 2.85 14H2.8v-4h.05A1.8 1.8 0 0 0 4.5 8.9a1.8 1.8 0 0 0-.35-2L4.1 6.85 6.85 4.1l.05.05a1.8 1.8 0 0 0 2 .35A1.8 1.8 0 0 0 10 2.85V2.8h4v.05a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.35l.05-.05 2.75 2.75-.05.05a1.8 1.8 0 0 0-.35 2A1.8 1.8 0 0 0 21.15 10h.05v4h-.05A1.8 1.8 0 0 0 19.4 15Z"/></IconBase>; }
export function PlusIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M12 5v14M5 12h14"/></IconBase>; }
export function SunIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></IconBase>; }
export function MoonIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/></IconBase>; }
