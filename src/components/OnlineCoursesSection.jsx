import React from 'react';
import SectionHeader from './SectionHeader';

export default function OnlineCoursesSection({ courses, isEditing, onChange }) {
  const handleUpdate = (index, text) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], text };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...courses, { id: `oc-${Date.now()}`, text: "New Certification / Specialization (Platform)" }]);
  };

  const handleDelete = (index) => {
    onChange(courses.filter((_, i) => i !== index));
  };

  return (
    <section className="section">
      <div className="section-title-wrap">
        <SectionHeader title="Online Courses" />
        {isEditing && (
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAdd}>
            ➕ Add Course
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-list-container">
          {courses.map((course, idx) => (
            <div key={course.id || idx} className="edit-list-item-row">
              <input
                type="text"
                className="edit-input"
                value={course.text}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                placeholder="Course or certification title"
              />
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
          {courses.map((course, idx) => (
            <li key={course.id || idx}>{course.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
