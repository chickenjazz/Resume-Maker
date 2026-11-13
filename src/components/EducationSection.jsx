import React from 'react';
import SectionHeader from './SectionHeader';

export default function EducationSection({ education, isEditing, onChange }) {
  const handleUpdateEntry = (index, updatedEntry) => {
    const updated = [...education];
    updated[index] = updatedEntry;
    onChange(updated);
  };

  const handleAddEntry = () => {
    const newEntry = {
      id: `edu-${Date.now()}`,
      degree: "Degree Title",
      institution: "University / Institution Name",
      location: "City, ST",
      graduationDate: "Graduated: Month Year",
      bullets: [
        {
          id: `edu-b-${Date.now()}`,
          highlight: "Relevant Coursework:",
          text: "Course 1, Course 2, Course 3"
        }
      ]
    };
    onChange([...education, newEntry]);
  };

  const handleDeleteEntry = (index) => {
    if (confirm('Delete this education entry?')) {
      onChange(education.filter((_, i) => i !== index));
    }
  };

  const handleUpdateBullet = (entryIndex, bulletIndex, field, value) => {
    const entry = { ...education[entryIndex] };
    const updatedBullets = [...entry.bullets];
    updatedBullets[bulletIndex] = { ...updatedBullets[bulletIndex], [field]: value };
    entry.bullets = updatedBullets;
    handleUpdateEntry(entryIndex, entry);
  };

  const handleAddBullet = (entryIndex) => {
    const entry = { ...education[entryIndex] };
    entry.bullets = [
      ...entry.bullets,
      {
        id: `edu-b-${Date.now()}`,
        highlight: "Honors / Capstone:",
        text: "Details about project or achievements"
      }
    ];
    handleUpdateEntry(entryIndex, entry);
  };

  const handleDeleteBullet = (entryIndex, bulletIndex) => {
    const entry = { ...education[entryIndex] };
    entry.bullets = entry.bullets.filter((_, i) => i !== bulletIndex);
    handleUpdateEntry(entryIndex, entry);
  };

  return (
    <section className="section">
      <div className="section-title-wrap">
        <
          r title="Education" />
        {isEditing && (
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAddEntry}>
            ➕ Add Degree / School
          </button>
        )}
      </div>

      {education.map((entry, entryIdx) => (
        <article key={entry.id || entryIdx} className={`entry ${isEditing ? 'editing-box' : ''}`}>
          {isEditing ? (
            <div className="entry-edit-form">
              <div className="entry-actions-top">
                <span className="badge">Degree #{entryIdx + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger-sm"
                  onClick={() => handleDeleteEntry(entryIdx)}
                >
                  ✕ Remove Degree
                </button>
              </div>

              <div className="grid-2">
                <div>
                  <label className="edit-label">Degree Title</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.degree}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, degree: e.target.value })}
                  />
                </div>
                <div>
                  <label className="edit-label">Institution</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.institution}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, institution: e.target.value })}
                  />
                </div>
                <div>
                  <label className="edit-label">Location</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.location}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="edit-label">Graduation Date</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.graduationDate}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, graduationDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="bullets-edit-section">
                <label className="edit-label">Coursework / Honors / Projects</label>
                {entry.bullets.map((b, bIdx) => (
                  <div key={b.id || bIdx} className="bullet-edit-row">
                    <input
                      type="text"
                      className="edit-input bullet-highlight-input"
                      placeholder="Label (e.g., Relevant Coursework:)"
                      value={b.highlight || ''}
                      onChange={(e) => handleUpdateBullet(entryIdx, bIdx, 'highlight', e.target.value)}
                    />
                    <textarea
                      className="edit-textarea bullet-text-input"
                      rows={2}
                      value={b.text}
                      onChange={(e) => handleUpdateBullet(entryIdx, bIdx, 'text', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-icon-danger"
                      onClick={() => handleDeleteBullet(entryIdx, bIdx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleAddBullet(entryIdx)}
                >
                  + Add Bullet Point
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="entry-header">
                <div className="entry-title">{entry.degree}</div>
                <div className="entry-subtitle">{entry.institution} | {entry.location}</div>
                {entry.graduationDate && (
                  <div className="entry-subtitle">
                    {entry.graduationDate.startsWith('Graduated:') || entry.graduationDate.startsWith('Target Graduation:')
                      ? entry.graduationDate
                      : `${entry.gradStatus || 'Graduated'}: ${entry.graduationDate}`}
                  </div>
                )}
              </div>
              <ul className="bullet-list">
                {entry.bullets.map((b, bIdx) => (
                  <li key={b.id || bIdx}>
                    {b.highlight ? <strong>{b.highlight}  </strong> : null}
                    {b.text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
