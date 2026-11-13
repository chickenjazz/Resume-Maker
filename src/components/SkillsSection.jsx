import React from 'react';
import SectionHeader from './SectionHeader';

export default function SkillsSection({ skills, isEditing, onChange }) {
  const handleUpdate = (index, field, value) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...skills,
      {
        id: `sk-${Date.now()}`,
        category: "Skill Category:",
        text: "Skill 1, Skill 2, Skill 3, Tool 4, Library 5"
      }
    ]);
  };

  const handleDelete = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <section className="section">
      <div className="section-title-wrap">
        <SectionHeader title="Skills" />
        {isEditing && (
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAdd}>
            ➕ Add Category
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-list-container">
          {skills.map((skill, idx) => (
            <div key={skill.id || idx} className="skill-edit-row">
              <div className="skill-edit-inputs">
                <input
                  type="text"
                  className="edit-input skill-category-input"
                  value={skill.category}
                  onChange={(e) => handleUpdate(idx, 'category', e.target.value)}
                  placeholder="Category Name:"
                />
                <input
                  type="text"
                  className="edit-input skill-text-input"
                  value={skill.text}
                  onChange={(e) => handleUpdate(idx, 'text', e.target.value)}
                  placeholder="Comma-separated list of skills..."
                />
              </div>
              <button
                type="button"
                className="btn btn-icon-danger"
                onClick={() => handleDelete(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ul className="bullet-list">
          {skills.map((skill, idx) => (
            <li key={skill.id || idx}>
              <strong>{skill.category} </strong>
              {skill.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
