"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import AddTransactionModal from "@/components/AddTransactionModal";

const nav=[
  ["/","Trang chủ","home"], ["/transactions","Giao dịch","list"], ["/budgets","Ngân sách","budget"], ["/statistics","Thống kê","stats"], ["/wallets","Ví","wallet"], ["/settings","Cá nhân","user"]
] as const;
export default function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname(); const [add,setAdd]=useState(false);
 return <div className="app-shell">
   <aside className="sidebar">
     <div className="brand"><span className="brand-mark">₫</span><div><strong>TIỀN ĐI ĐÂU</strong><small>Biết tiền đi đâu.</small></div></div>
     <nav>{nav.map(([href,label,icon])=><Link key={href} href={href} className={path===href?"active":""}><Icon name={icon}/><span>{label}</span></Link>)}</nav>
     <div className="sidebar-bottom"><ThemeToggle/><span>V1.0.0</span></div>
   </aside>
   <main className="main">{children}</main>
   <nav className="bottom-nav">
     {nav.filter(([href])=>["/","/transactions","/statistics","/settings"].includes(href)).map(([href,label,icon],i)=><div key={href} className="bottom-item-wrap">
       {i===2 && <button className="fab" onClick={()=>setAdd(true)} aria-label="Thêm giao dịch"><Icon name="plus" size={28}/></button>}
       <Link href={href} className={path===href?"active":""}><Icon name={icon}/><span>{label}</span></Link>
     </div>)}
   </nav>
   <button className="desktop-add" onClick={()=>setAdd(true)}><Icon name="plus"/> Thêm giao dịch</button>
   {add&&<AddTransactionModal onClose={()=>setAdd(false)} onSaved={()=>{setAdd(false);window.dispatchEvent(new Event("tdd:data-changed"));}}/>}
 </div>
}
