import React, { useRef } from 'react';

export default function Toolbar({
  isEditing,
  onToggleEdit,
  onPrint,
  onReset,
  onExportJSON,
  onImportJSON,
  hasSavedIndicator
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result);
          onImportJSON(parsed);
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="screen-toolbar" aria-label="Resume Editor Toolbar">
      <div className="toolbar-left">
        <div className="toolbar-title">
          <span>📄 Resume Editor</span>
          {hasSavedIndicator && <span className="edit-status">✓ Saved</span>}
        </div>
        <div className="toolbar-tip">
          💡 In print dialog, uncheck <strong>Headers and footers</strong> for a clean PDF.
        </div>
      </div>

      <div className="toolbar-actions">
        <button
          type="button"
          className={`btn ${isEditing ? 'btn-success' : 'btn-secondary'}`}
          onClick={onToggleEdit}
        >
          {isEditing ? '💾 Done Editing' : '✏️ Edit Resume'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExportJSON}
          title="Save resume data as a JSON file"
        >
          📥 Export JSON
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          title="Load resume data from a JSON file"
        >
          📤 Import JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="btn btn-primary"
          onClick={onPrint}
        >
          🖨️ Print / Save as PDF
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
        >
          ↺ Reset
        </button>
      </div>
    </aside>
  );
}
