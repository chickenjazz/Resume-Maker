import React, { useRef } from 'react';
import { PanelLeftClose, PanelLeftOpen, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { Header } from '@/components/ui/header-2';
import { Button } from '@/components/ui/button';
import { SaveIcon } from '@/components/ui/save-icon';

export default function AppHeader({ sidebarOpen, onToggleSidebar, onPrint, onExport, onImport, onReset, saved, scrollTarget }) {
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
    { label: 'Export', icon: <Download />, onClick: onExport },
    { label: 'Import', icon: <Upload />, onClick: () => fileRef.current?.click() },
    { label: 'Reset', icon: <RotateCcw />, onClick: onReset },
    { label: 'Save', icon: <SaveIcon size={16} />, onClick: onPrint, variant: 'default' },
  ];
  return (
    <div className="workspace-header-shell">
      <Header scrollTarget={scrollTarget} actions={actions} leading={
        <Button variant="ghost" className="h-11 w-11 shrink-0 px-0"
          onClick={onToggleSidebar} aria-expanded={sidebarOpen} aria-controls="editor-sidebar"
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
          {sidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      } brand={
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold leading-none tracking-tight text-primary lg:text-[22px]">el<span className="text-orange-700">CV</span>ate</span>
            <span className="hidden text-[10px] leading-none text-muted-foreground lg:block">Resume builder by jrm</span>
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
