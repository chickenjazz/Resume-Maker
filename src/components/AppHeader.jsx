import React, { useRef } from 'react';
import {
  PanelLeftClose, PanelLeftOpen,
  Printer, Download, Upload, RotateCcw, Check, Edit3, Eye
} from 'lucide-react';

export default function AppHeader({
  sidebarOpen,
  onToggleSidebar,
  isEditing,
  onToggleEdit,
  onPrint,
  onExport,
  onImport,
  onReset,
  saved
}) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        onImport(JSON.parse(ev.target.result));
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img src="/favicon.svg" alt="" className="app-header__brand-icon" aria-hidden="true" />
        <div className="app-header__brand-copy">
          <span className="app-header__title">el<span className="app-header__title-cv">CV</span>ate</span>
          <span className="app-header__tagline">by jrm</span>
        </div>
        {saved && (
          <span className="status-pill">
            <Check size={12} /> Saved
          </span>
        )}
      </div>

      <div className="app-header__actions">
        {/* Primary Edit Mode Toggle Button */}
        <button
          className={`btn btn--edit-toggle ${isEditing ? 'btn--edit-active' : ''}`}
          onClick={onToggleEdit}
          title={isEditing ? 'Click to exit edit mode and preview the resume' : 'Click to enter edit mode and click anywhere to edit'}
        >
          {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
          <span>{isEditing ? 'Preview' : 'Edit'}</span>
        </button>

        {/* Sidebar Toggle */}
        <button
          className="btn btn--ghost"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          <span>{sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}</span>
        </button>

        <button className="btn btn--ghost" onClick={onExport} title="Download resume as JSON">
          <Download size={16} />
          <span>Export</span>
        </button>

        <button className="btn btn--ghost" onClick={() => fileRef.current?.click()} title="Import existing resume JSON">
          <Upload size={16} />
          <span>Import</span>
        </button>
        <input type="file" ref={fileRef} onChange={handleFile} accept=".json" hidden />

        <button className="btn btn--ghost" onClick={onReset} title="Reset to default template">
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        {/* Print / Save to PDF */}
        <button className="btn btn--primary" onClick={onPrint} title="Print or save as PDF">
          <Printer size={16} />
          <span>Print / PDF</span>
        </button>
      </div>
    </header>
  );
}
