import React from 'react';

export default function ResumeHeader({ header, isEditing, onChange }) {
  if (isEditing) {
    return (
      <header className="resume-header editing-card">
        <div className="edit-group">
          <label className="edit-label">Full Name</label>
          <input
            type="text"
            className="edit-input name-input"
            value={header.name}
            onChange={(e) => onChange({ ...header, name: e.target.value })}
            placeholder="Your Full Name"
          />
        </div>
        <div className="edit-row">
          <div className="edit-group">
            <label className="edit-label">Phone</label>
            <input
              type="text"
              className="edit-input"
              value={header.phone}
              onChange={(e) => onChange({ ...header, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div className="edit-group">
            <label className="edit-label">Email</label>
            <input
              type="email"
              className="edit-input"
              value={header.email}
              onChange={(e) => onChange({ ...header, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          <div className="edit-group">
            <label className="edit-label">LinkedIn Text / URL</label>
            <input
              type="text"
              className="edit-input"
              value={header.linkedin}
              onChange={(e) => onChange({ ...header, linkedin: e.target.value, linkedinUrl: `https://${e.target.value.replace(/^https?:\/\//, '')}` })}
              placeholder="linkedin.com/in/yourname"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="resume-header">
      <h1 className="name">{header.name}</h1>
      <div className="contact-info">
        <span className="contact-item">{header.phone}</span>
        <span className="separator">|</span>
        <a href={`mailto:${header.email}`} className="contact-item">
          {header.email}
        </a>
        <span className="separator">|</span>
        <a
          href={header.linkedinUrl || `https://${header.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
        >
          {header.linkedin}
        </a>
      </div>
    </header>
  );
}
