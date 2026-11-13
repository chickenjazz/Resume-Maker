import React from 'react';
import SectionHeader from './SectionHeader';

export default function ExperienceSection({ experience, isEditing, onChange }) {
  const handleUpdateEntry = (index, updatedEntry) => {
    const updated = [...experience];
    updated[index] = updatedEntry;
    onChange(updated);
  };

  const handleAddEntry = () => {
    const newEntry = {
      id: `exp-${Date.now()}`,
      role: "Job Title",
      company: "Company Name",
      location: "City, ST",
      period: "Month Year – Present",
      bullets: [
        {
          id: `exp-b-${Date.now()}`,
          highlight: "Key Achievement / Project:",
          text: "Describe your impact, tools used, and measurable results achieved."
        }
      ]
    };
    onChange([...experience, newEntry]);
  };

  const handleDeleteEntry = (index) => {
    if (confirm('Delete this experience entry?')) {
      onChange(experience.filter((_, i) => i !== index));
    }
  };

  const handleUpdateBullet = (entryIndex, bulletIndex, field, value) => {
    const entry = { ...experience[entryIndex] };
    const updatedBullets = [...entry.bullets];
    updatedBullets[bulletIndex] = { ...updatedBullets[bulletIndex], [field]: value };
    entry.bullets = updatedBullets;
    handleUpdateEntry(entryIndex, entry);
  };

  const handleAddBullet = (entryIndex) => {
    const entry = { ...experience[entryIndex] };
    entry.bullets = [
      ...entry.bullets,
      {
        id: `bullet-${Date.now()}`,
        highlight: "",
        text: "New accomplishment or responsibility"
      }
    ];
    handleUpdateEntry(entryIndex, entry);
  };

  const handleDeleteBullet = (entryIndex, bulletIndex) => {
    const entry = { ...experience[entryIndex] };
    entry.bullets = entry.bullets.filter((_, i) => i !== bulletIndex);
    handleUpdateEntry(entryIndex, entry);
  };

  return (
    <section className="section">
      <div className="section-title-wrap">
        <SectionHeader title="Experience" />
        {isEditing && (
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAddEntry}>
            ➕ Add Job / Role
          </button>
        )}
      </div>

      {experience.map((entry, entryIdx) => (
        <article key={entry.id || entryIdx} className={`entry ${isEditing ? 'editing-box' : ''}`}>
          {isEditing ? (
            <div className="entry-edit-form">
              <div className="entry-actions-top">
                <span className="badge">Role #{entryIdx + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger-sm"
                  onClick={() => handleDeleteEntry(entryIdx)}
                >
                  ✕ Remove Role
                </button>
              </div>

              <div className="grid-2">
                <div>
                  <label className="edit-label">Role Title</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.role}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="edit-label">Company Name</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={entry.company}
                    onChange={(e) => handleUpdateEntry(entryIdx, { ...entry, company: e.target.value })}
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
                  <label className="edit-label">Start Date</label>
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. May 2024"
                    value={entry.startDate !== undefined ? entry.startDate : (entry.period ? entry.period.split(/[–-]/)[0]?.trim() : '')}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const endDate = entry.endDate || '';
                      handleUpdateEntry(entryIdx, {
                        ...entry,
                        startDate,
                        period: (startDate && endDate) ? `${startDate} – ${endDate}` : (startDate || endDate || '')
                      });
                    }}
                  />
                </div>
                <div>
                  <label className="edit-label">End Date</label>
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. Present"
                    value={entry.endDate !== undefined ? entry.endDate : (entry.period ? entry.period.split(/[–-]/)[1]?.trim() : '')}
                    onChange={(e) => {
                      const endDate = e.target.value;
                      const startDate = entry.startDate || '';
                      handleUpdateEntry(entryIdx, {
                        ...entry,
                        endDate,
                        period: (startDate && endDate) ? `${startDate} – ${endDate}` : (startDate || endDate || '')
                      });
                    }}
                  />
                </div>
              </div>

              <div className="bullets-edit-section">
                <label className="edit-label">Bullet Points</label>
                {entry.bullets.map((b, bIdx) => (
                  <div key={b.id || bIdx} className="bullet-edit-row">
                    <input
                      type="text"
                      className="edit-input bullet-highlight-input"
                      placeholder="Bold Heading (Optional)"
                      value={b.highlight || ''}
                      onChange={(e) => handleUpdateBullet(entryIdx, bIdx, 'highlight', e.target.value)}
                    />
                    <textarea
                      className="edit-textarea bullet-text-input"
                      rows={2}
                      placeholder="Bullet point description..."
                      value={b.text}
                      onChange={(e) => handleUpdateBullet(entryIdx, bIdx, 'text', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-icon-danger"
                      title="Delete bullet"
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
                <div className="entry-title">
                  {entry.role} | {entry.company} | {entry.location}
                </div>
                <div className="entry-subtitle">
                  {(entry.startDate && entry.endDate)
                    ? `${entry.startDate} – ${entry.endDate}`
                    : (entry.startDate || entry.endDate || entry.period)}
                </div>
              </div>
              <ul className="bullet-list">
                {entry.bullets.map((b, bIdx) => (
                  <li key={b.id || bIdx}>
                    {b.highlight ? <strong>{b.highlight} </strong> : null}
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
