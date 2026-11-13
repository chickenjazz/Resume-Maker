import React from 'react';
import SectionHeader from './SectionHeader';

export default function SummarySection({ summary, isEditing, onChange }) {
  return (
    <section className="section">
      <SectionHeader title="Summary" />
      {isEditing ? (
        <textarea
          className="edit-textarea"
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your professional summary here..."
        />
      ) : (
        <p className="summary-text">{summary}</p>
      )}
    </section>
  );
}
