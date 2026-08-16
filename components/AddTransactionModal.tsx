"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { formatCurrency, todayKey } from "@/lib/format";
import type { MetaData, TransactionType } from "@/types";

export default function AddTransactionModal({onClose,onSaved}:{onClose:()=>void,onSaved:()=>void}){
 const [type,setType]=useState<TransactionType>("expense"); const [meta,setMeta]=useState<MetaData|null>(null); const [saving,setSaving]=useState(false); const [error,setError]=useState("");
 const [amount,setAmount]=useState(""); const [categoryId,setCategoryId]=useState(""); const [accountId,setAccountId]=useState(""); const [toAccountId,setToAccountId]=useState(""); const [dateKey,setDateKey]=useState(todayKey()); const [note,setNote]=useState("");
 useEffect(()=>{document.body.classList.add("modal-open"); fetch("/api/meta").then(r=>r.json()).then(d=>{setMeta(d);setAccountId(d.accounts?.[0]?.id||"");setToAccountId(d.accounts?.[1]?.id||"")}).catch(()=>setError("Không tải được dữ liệu")); return()=>document.body.classList.remove("modal-open")},[]);
 const cats=useMemo(()=>meta?.categories.filter(c=>c.type===type)||[],[meta,type]);
 useEffect(()=>{if(type!=="transfer"&&cats.length&&!cats.some(c=>c.id===categoryId)) setCategoryId(cats[0].id)},[type,cats,categoryId]);
 async function submit(e:FormEvent){e.preventDefault();setSaving(true);setError("");try{const res=await fetch("/api/transactions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type,amount:Number(amount),categoryId,accountId,toAccountId,dateKey,note})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Không thể lưu");onSaved()}catch(e:any){setError(e.message)}finally{setSaving(false)}}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="sheet modal-card">
  <div className="modal-head"><div><h2>Thêm giao dịch</h2><p>Nhập nhanh trong vài giây.</p></div><button className="icon-btn" onClick={onClose}><Icon name="close"/></button></div>
  <div className="segmented"><button className={type==="expense"?"active":""} onClick={()=>setType("expense")}>Chi tiền</button><button className={type==="income"?"active":""} onClick={()=>setType("income")}>Thu tiền</button><button className={type==="transfer"?"active":""} onClick={()=>setType("transfer")}>Chuyển tiền</button></div>
  <form onSubmit={submit}>
   <label className="amount-field"><span>Số tiền</span><input autoFocus inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value.replace(/\D/g,""))} placeholder="0"/><strong>{amount?formatCurrency(Number(amount)):"0 ₫"}</strong></label>
   {type!=="transfer"&&<div className="field"><label>Danh mục</label><div className="category-grid">{cats.slice(0,8).map(c=><button type="button" key={c.id} className={categoryId===c.id?"category-chip selected":"category-chip"} onClick={()=>setCategoryId(c.id)}><span>{c.icon}</span><small>{c.name}</small></button>)}</div>{cats.length>8&&<select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>{cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>}</div>}
   <div className="form-grid"><div className="field"><label>{type==="transfer"?"Từ ví":"Ví"}</label><select value={accountId} onChange={e=>setAccountId(e.target.value)}>{meta?.accounts.map(a=><option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}</select></div>{type==="transfer"&&<div className="field"><label>Sang ví</label><select value={toAccountId} onChange={e=>setToAccountId(e.target.value)}>{meta?.accounts.filter(a=>a.id!==accountId).map(a=><option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}</select></div>}<div className="field"><label>Ngày</label><input type="date" value={dateKey} onChange={e=>setDateKey(e.target.value)}/></div></div>
   <div className="field"><label>Ghi chú <span className="muted">(không bắt buộc)</span></label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ví dụ: Ăn trưa, đổ xăng..." maxLength={300}/></div>
   {error&&<div className="alert error">{error}</div>}
   <button className="primary-btn full" disabled={saving||!amount||!accountId}>{saving?"Đang lưu...":"Lưu giao dịch"}</button>
  </form>
 </div></div>
}
