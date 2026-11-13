import React from 'react';
import SectionHeader from './SectionHeader';

export default function CourseProjectsSection({ projects, isEditing, onChange }) {
  const handleUpdate = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...projects,
      {
        id: `cp-${Date.now()}`,
        highlight: "Project Title",
        separator: " – ",
        text: "Project description detailing technologies, architecture, and results."
      }
    ]);
  };

  const handleDelete = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <section className="section">
      <div className="section-title-wrap">
        <SectionHeader title="Projects" />
        {isEditing && (
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAdd}>
            ➕ Add Project
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-list-container">
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="editing-box project-edit-box">
              <div className="entry-actions-top">
                <span className="badge">Project #{idx + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger-sm"
                  onClick={() => handleDelete(idx)}
                >
                  ✕ Remove
                </button>
              </div>
              <div className="mb-2">
                <label className="edit-label">Project Title</label>
                <input
                  type="text"
                  className="edit-input"
                  value={proj.highlight}
                  onChange={(e) => handleUpdate(idx, 'highlight', e.target.value)}
                  placeholder="e.g. Data Science Project: Multimodal Dog Emotion Classifier"
                />
              </div>
              <div>
                <label className="edit-label">Description & Results</label>
                <textarea
                  className="edit-textarea"
                  rows={3}
                  value={proj.text}
                  onChange={(e) => handleUpdate(idx, 'text', e.target.value)}
                  placeholder="Describe your implementation and results..."
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="bullet-list">
          {projects.map((proj, idx) => (
            <li key={proj.id || idx}>
              <strong>{proj.highlight}</strong>
              {proj.separator || ' – '}
              {proj.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
