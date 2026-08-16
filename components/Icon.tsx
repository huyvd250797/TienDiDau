import React from "react";

type Name = "home"|"list"|"stats"|"user"|"plus"|"wallet"|"budget"|"search"|"filter"|"eye"|"eyeOff"|"sun"|"moon"|"chevron"|"close"|"edit"|"trash"|"logout"|"download"|"tag";
const paths: Record<Name, React.ReactNode> = {
  home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V21h14V9.8"/><path d="M9 21v-7h6v7"/></>,
  list:<><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>,
  stats:<><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
  user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  plus:<path d="M12 5v14M5 12h14"/>,
  wallet:<><path d="M3 6h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6Z"/><path d="M3 6l2-3h13l1 3"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></>,
  budget:<><circle cx="12" cy="12" r="9"/><path d="M12 6v12M15.5 8.5c-1-1-5-1-5 1.5 0 3 5 1 5 4 0 2.5-4 2.5-5 1.5"/></>,
  search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  filter:<path d="M4 5h16M7 12h10M10 19h4"/>,
  eye:<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  eyeOff:<><path d="m3 3 18 18"/><path d="M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-2.1 2.8M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6c1.3 0 2.5-.2 3.5-.6"/></>,
  sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon:<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
  chevron:<path d="m9 18 6-6-6-6"/>, close:<path d="M6 6l12 12M18 6 6 18"/>, edit:<><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></>, trash:<><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></>, logout:<><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h7v18h-7"/></>, download:<><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>, tag:<><path d="M20 13 13 20 4 11V4h7l9 9Z"/><circle cx="8" cy="8" r="1"/></>
};
export default function Icon({name,size=22}:{name:Name,size?:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>; }
