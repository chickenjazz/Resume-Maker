import React from 'react';
import { X } from 'lucide-react';

export default function AppModal({ title, message, confirmLabel = 'OK', confirmClassName = 'btn--primary', cancelLabel, onConfirm, onCancel }) {
  return (
    <div className="app-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="app-modal" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
        <div className="app-modal__header">
          <h2 id="app-modal-title">{title}</h2>
          <button type="button" className="app-modal__close" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <p className="app-modal__message">{message}</p>
        <div className="app-modal__actions">
          {cancelLabel && <button type="button" className="btn btn--ghost-dark" onClick={onCancel}>{cancelLabel}</button>}
          <button type="button" className={`btn ${confirmClassName}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
