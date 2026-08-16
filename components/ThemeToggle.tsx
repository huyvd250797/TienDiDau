"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
export default function ThemeToggle() {
  const [dark,setDark]=useState(false);
  useEffect(()=>{ const saved=localStorage.getItem("tdd-theme"); const next=saved ? saved==="dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; setDark(next); document.documentElement.dataset.theme=next?"dark":"light"; },[]);
  function toggle(){ const next=!dark; setDark(next); document.documentElement.dataset.theme=next?"dark":"light"; localStorage.setItem("tdd-theme",next?"dark":"light"); }
  return <button className="icon-btn" onClick={toggle} aria-label="Đổi giao diện sáng tối" title="Đổi giao diện"><Icon name={dark?"sun":"moon"}/></button>;
}
