"use client";
import { useEffect } from "react";
export default function Toast({message,onClose}:{message:string,onClose:()=>void}){useEffect(()=>{const t=setTimeout(onClose,2600);return()=>clearTimeout(t)},[onClose]);return <div className="toast">{message}</div>}
