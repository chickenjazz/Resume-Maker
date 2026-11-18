import React, { useRef } from 'react';
import { PanelLeftClose, PanelLeftOpen, Printer, Download, Upload, RotateCcw, Check, Edit3, Eye } from 'lucide-react';
import { Header } from '@/components/ui/header-2';

export default function AppHeader({ sidebarOpen, onToggleSidebar, isEditing, onToggleEdit, onPrint, onExport, onImport, onReset, saved, scrollTarget }) {
  const fileRef = useRef(null);
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { onImport(JSON.parse(reader.result)); }
      catch { onImport(null); }
    };
    reader.onerror = () => onImport(null);
    reader.readAsText(file);
    event.target.value = '';
  };
  const actions = [
    { label: isEditing ? 'Preview' : 'Edit', icon: isEditing ? <Eye /> : <Edit3 />, onClick: onToggleEdit, variant: 'outline' },
    { label: sidebarOpen ? 'Hide sidebar' : 'Show sidebar', icon: sidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />, onClick: onToggleSidebar, expanded: sidebarOpen, controls: 'editor-sidebar' },
    { label: 'Export', icon: <Download />, onClick: onExport },
    { label: 'Import', icon: <Upload />, onClick: () => fileRef.current?.click() },
    { label: 'Reset', icon: <RotateCcw />, onClick: onReset },
    { label: 'Print / PDF', icon: <Printer />, onClick: onPrint, variant: 'default' },
  ];
  return (
    <div className="workspace-header-shell">
      <Header scrollTarget={scrollTarget} actions={actions} brand={
        <div className="flex shrink-0 items-center gap-3">
          <img src="/favicon.svg" alt="" className="size-8 rounded-lg" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold leading-none tracking-tight text-primary">elCVate</span>
            <span className="text-[10px] leading-none text-muted-foreground">Resume builder by jrm</span>
          </div>
          <span role="status" className="hidden w-14 items-center gap-1 text-xs text-muted-foreground lg:flex">
            {saved && <><Check className="size-3" /> Saved</>}
          </span>
        </div>
      } />
      <input aria-label="Import resume JSON" type="file" ref={fileRef} onChange={handleFile} accept=".json" hidden />
    </div>
  );
}
