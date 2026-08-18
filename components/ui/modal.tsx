"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({ title, description, children, onClose, wide = false }: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`modal-card ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="icon-btn" aria-label="Đóng" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}

export function Toast({ message, tone = "success" }: { message: string; tone?: "success" | "danger" | "warning" }) {
  return <div className={`toast ${tone}`} role="status">{message}</div>;
}
