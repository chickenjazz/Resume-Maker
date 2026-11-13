import React from 'react';
import { Plus, Trash2, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import EditableText from './EditableText';

export default function ResumePreview({
  data,
  setData,
  isEditing = false,
  onAddItem
}) {
  const { header, summary, experience, education, certifications, onlineCourses, projects, courseProjects, skills } = data;
  const hiddenSections = data.hiddenSections || [];
  const hiddenItems = data.hiddenItems || [];
  const accentColor = data.theme?.accent || '#153b6b';

  const showSection = (key) => !hiddenSections.includes(key);
  const showItem = (id) => !hiddenItems.includes(id);

  /* ---- Deep update helper ---- */
  const update = (updater) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      updater(copy);
      return copy;
    });
  };

  const reorderItems = (group, sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    update(d => {
      let list;
      if (group === 'experience') list = d.experience;
      else if (group === 'education') list = d.education;
      else if (group === 'certifications') list = d.certifications;
      else if (group === 'onlineCourses') list = d.onlineCourses;
      else if (group === 'projects') list = d.projects || d.courseProjects;
      else if (group === 'skills') list = d.skills;
      else if (group.startsWith('experience-bullets:')) {
        const entry = d.experience?.find(item => item.id === group.slice(19));
        list = entry?.bullets;
      } else if (group.startsWith('education-bullets:')) {
        const entry = d.education?.find(item => item.id === group.slice(18));
        list = entry?.bullets;
      }

      if (!list) return;
      const sourceIndex = list.findIndex(item => item.id === sourceId);
      const targetIndex = list.findIndex(item => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return;
      const [item] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, item);
    });
  };

  const handleDragStart = (event, group, id) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ group, id }));
    event.currentTarget.classList.add('is-dragging');
  };

  const handleDragEnd = (event) => {
    event.currentTarget.classList.remove('is-dragging');
  };

  const handleDrop = (event, group, targetId) => {
    event.preventDefault();
    try {
      const source = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (source.group === group) reorderItems(group, source.id, targetId);
    } catch { /* Ignore drops that are not resume items. */ }
  };

  /* ---- Header updates ---- */
  const updateHeader = (field, val) => {
    update(d => {
      d.header[field] = val;
    });
  };

  /* ---- Summary update ---- */
  const updateSummary = (val) => {
    update(d => {
      d.summary = val;
    });
  };

  // Date parsing helper to sort dates with latest on top
  const parseResumeDate = (str) => {
    if (!str) return 0;
    const trimmed = str.trim().toLowerCase();
    if (trimmed.includes('present') || trimmed.includes('current') || trimmed.includes('now') || trimmed.includes('ongoing')) {
      return Infinity;
    }

    // Check for MM/YYYY or MM-YYYY
    const slashMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/);
    if (slashMatch) {
      const month = parseInt(slashMatch[1], 10) - 1;
      const year = parseInt(slashMatch[2], 10);
      return new Date(year, month, 1).getTime();
    }

    // Check for YYYY-MM
    const isoMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})$/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      return new Date(year, month, 1).getTime();
    }

    // Try finding 4-digit year and month name
    const yearMatch = str.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      let month = 0;
      for (let i = 0; i < months.length; i++) {
        if (trimmed.includes(months[i])) {
          month = i;
          break;
        }
      }
      return new Date(year, month, 1).getTime();
    }

    const parsed = Date.parse(str);
    return !isNaN(parsed) ? parsed : 0;
  };

  const getEndDateStr = (item) => {
    if (item.endDate) return item.endDate;
    if (item.period) {
      const parts = item.period.split(/[–—\-]/);
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
    return '';
  };

  const getStartDateStr = (item) => {
    if (item.startDate) return item.startDate;
    if (item.period) {
      const parts = item.period.split(/[–—\-]/);
      return parts[0].trim();
    }
    return '';
  };

  const compareExperience = (a, b) => {
    // 1. Sort by end date descending (Present / 2024 > 2023)
    const endA = parseResumeDate(getEndDateStr(a));
    const endB = parseResumeDate(getEndDateStr(b));

    if (endA !== endB) {
      return endB - endA;
    }

    // 2. If end dates match (e.g. both Present), sort by start date descending
    const startA = parseResumeDate(getStartDateStr(a));
    const startB = parseResumeDate(getStartDateStr(b));

    return startB - startA;
  };

  const getExpEntry = (d, idOrIdx) => {
    if (typeof idOrIdx === 'string') {
      return d.experience.find(e => e.id === idOrIdx);
    }
    return d.experience[idOrIdx];
  };

  const getExpIdx = (d, idOrIdx) => {
    if (typeof idOrIdx === 'string') {
      return d.experience.findIndex(e => e.id === idOrIdx);
    }
    return idOrIdx;
  };

  /* ---- Experience updates ---- */
  const updateExpField = (idOrIdx, field, val) => {
    update(d => {
      const entry = getExpEntry(d, idOrIdx);
      if (entry) {
        entry[field] = val;
        // Keep period in sync when startDate or endDate is edited
        if (field === 'startDate' || field === 'endDate') {
          const s = field === 'startDate' ? val : (entry.startDate || '');
          const e = field === 'endDate' ? val : (entry.endDate || '');
          entry.period = (s && e) ? `${s} – ${e}` : (s || e || '');
        }
      }
    });
  };

  const updateExpBullet = (idOrIdx, bulletIdx, field, val) => {
    update(d => {
      const entry = getExpEntry(d, idOrIdx);
      if (entry && entry.bullets && entry.bullets[bulletIdx]) {
        entry.bullets[bulletIdx][field] = val;
      }
    });
  };

  const addExpBullet = (idOrIdx) => {
    update(d => {
      const entry = getExpEntry(d, idOrIdx);
      if (entry) {
        if (!entry.bullets) entry.bullets = [];
        entry.bullets.push({
          id: `bullet-${Date.now()}`,
          highlight: '',
          text: 'Describe key impact, technologies used, or measurable results.'
        });
      }
    });
  };

  const deleteExpBullet = (idOrIdx, bulletIdx) => {
    update(d => {
      const entry = getExpEntry(d, idOrIdx);
      if (entry && entry.bullets) {
        entry.bullets.splice(bulletIdx, 1);
      }
    });
  };

  const moveExpBullet = (idOrIdx, bulletIdx, direction) => {
    update(d => {
      const entry = getExpEntry(d, idOrIdx);
      if (entry && entry.bullets) {
        const newIdx = bulletIdx + direction;
        if (newIdx < 0 || newIdx >= entry.bullets.length) return;
        const [item] = entry.bullets.splice(bulletIdx, 1);
        entry.bullets.splice(newIdx, 0, item);
      }
    });
  };

  const deleteExpEntry = (idOrIdx) => {
    if (confirm('Delete this experience entry?')) {
      update(d => {
        const idx = getExpIdx(d, idOrIdx);
        if (idx !== -1 && idx !== undefined) {
          d.experience.splice(idx, 1);
        }
      });
    }
  };

  const addExperience = () => {
    if (onAddItem) {
      onAddItem('experience');
    } else {
      update(d => {
        d.experience.push({
          id: `exp-${Date.now()}`,
          role: 'Job Title',
          company: 'Company Name',
          location: 'City, State',
          startDate: 'Month Year',
          endDate: 'Present',
          period: 'Month Year – Present',
          bullets: [
            {
              id: `exp-b-${Date.now()}`,
              highlight: 'Key Achievement:',
              text: 'Describe your accomplishment and technical contribution.'
            }
          ]
        });
      });
    }
  };

  /* ---- Education updates ---- */
  const updateEduField = (idx, field, val) => {
    update(d => {
      d.education[idx][field] = val;
    });
  };

  const updateEduBullet = (eduIdx, bulletIdx, field, val) => {
    update(d => {
      d.education[eduIdx].bullets[bulletIdx][field] = val;
    });
  };

  const addEduBullet = (eduIdx) => {
    update(d => {
      d.education[eduIdx].bullets.push({
        id: `edu-b-${Date.now()}`,
        highlight: '',
        text: 'Relevant coursework, honors, or leadership activities.'
      });
    });
  };

  const deleteEduBullet = (eduIdx, bulletIdx) => {
    update(d => {
      d.education[eduIdx].bullets.splice(bulletIdx, 1);
    });
  };

  const moveEduBullet = (eduIdx, bulletIdx, direction) => {
    update(d => {
      const bullets = d.education[eduIdx].bullets;
      const newIdx = bulletIdx + direction;
      if (newIdx < 0 || newIdx >= bullets.length) return;
      const [item] = bullets.splice(bulletIdx, 1);
      bullets.splice(newIdx, 0, item);
    });
  };

  const deleteEduEntry = (eduIdx) => {
    if (confirm('Delete this education entry?')) {
      update(d => {
        d.education.splice(eduIdx, 1);
      });
    }
  };

  const addEducation = () => {
    if (onAddItem) {
      onAddItem('education');
    } else {
      update(d => {
        d.education.push({
          id: `edu-${Date.now()}`,
          degree: 'Degree / Certificate',
          institution: 'University / Institution',
          location: 'City, State',
          graduationDate: 'Graduation Year',
          bullets: []
        });
      });
    }
  };

  /* ---- Courses updates ---- */
  const updateCourse = (idx, val) => {
    update(d => {
      d.onlineCourses[idx].text = val;
    });
  };

  const deleteCourse = (idx) => {
    update(d => {
      d.onlineCourses.splice(idx, 1);
    });
  };

  const moveCourse = (idx, direction) => {
    update(d => {
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= d.onlineCourses.length) return;
      const [item] = d.onlineCourses.splice(idx, 1);
      d.onlineCourses.splice(newIdx, 0, item);
    });
  };

  const addCourse = () => {
    if (onAddItem) {
      onAddItem('onlineCourses');
    } else {
      update(d => {
        d.onlineCourses.push({
          id: `course-${Date.now()}`,
          text: 'Course Name – Issuing Organization or Platform'
        });
      });
    }
  };

  /* ---- Certifications updates ---- */
  const updateCertField = (idx, field, val) => {
    update(d => {
      if (!d.certifications) d.certifications = [];
      if (d.certifications[idx]) {
        d.certifications[idx][field] = val;
      }
    });
  };

  const deleteCert = (idx) => {
    update(d => {
      if (d.certifications) d.certifications.splice(idx, 1);
    });
  };

  const moveCert = (idx, direction) => {
    update(d => {
      if (!d.certifications) return;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= d.certifications.length) return;
      const [item] = d.certifications.splice(idx, 1);
      d.certifications.splice(newIdx, 0, item);
    });
  };

  const addCert = () => {
    if (onAddItem) {
      onAddItem('certifications');
    } else {
      update(d => {
        if (!d.certifications) d.certifications = [];
        d.certifications.push({
          id: `cert-${Date.now()}`,
          name: 'Certification Title',
          issuer: 'Issuing Organization',
          date: 'Year'
        });
      });
    }
  };

  /* ---- Projects updates ---- */
  const updateProjectField = (idx, field, val) => {
    update(d => {
      const list = d.projects || d.courseProjects;
      if (list && list[idx]) {
        list[idx][field] = val;
      }
    });
  };

  const deleteProject = (idx) => {
    update(d => {
      const list = d.projects || d.courseProjects;
      if (list) {
        list.splice(idx, 1);
      }
    });
  };

  const moveProject = (idx, direction) => {
    update(d => {
      const list = d.projects || d.courseProjects;
      if (!list) return;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= list.length) return;
      const [item] = list.splice(idx, 1);
      list.splice(newIdx, 0, item);
    });
  };

  const addProject = () => {
    if (onAddItem) {
      onAddItem('projects');
    } else {
      update(d => {
        if (!d.projects) d.projects = d.courseProjects || [];
        d.projects.push({
          id: `proj-${Date.now()}`,
          highlight: 'Project Title',
          separator: ' – ',
          text: 'Summary of features developed, architecture, and tech stack.'
        });
      });
    }
  };

  /* ---- Skills updates ---- */
  const updateSkillField = (idx, field, val) => {
    update(d => {
      d.skills[idx][field] = val;
    });
  };

  const deleteSkill = (idx) => {
    update(d => {
      d.skills.splice(idx, 1);
    });
  };

  const moveSkill = (idx, direction) => {
    update(d => {
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= d.skills.length) return;
      const [item] = d.skills.splice(idx, 1);
      d.skills.splice(newIdx, 0, item);
    });
  };

  const addSkill = () => {
    if (onAddItem) {
      onAddItem('skills');
    } else {
      update(d => {
        d.skills.push({
          id: `skill-${Date.now()}`,
          category: 'Category:',
          text: 'List of relevant tools and technologies separated by commas'
        });
      });
    }
  };

  // Header contact items with item-level visibility
  const contactElements = [];
  if (showItem('contact-location')) {
    contactElements.push(
      <EditableText
        key="location"
        value={header.location}
        onChange={(val) => updateHeader('location', val)}
        isEditing={isEditing}
        label="Location"
        placeholder="City, State"
      />
    );
  }
  if (showItem('contact-phone')) {
    contactElements.push(
      <EditableText
        key="phone"
        value={header.phone}
        onChange={(val) => updateHeader('phone', val)}
        isEditing={isEditing}
        label="Phone Number"
        placeholder="Phone number"
      />
    );
  }
  if (showItem('contact-email')) {
    contactElements.push(
      <EditableText
        key="email"
        value={header.email}
        onChange={(val) => updateHeader('email', val)}
        isEditing={isEditing}
        label="Email Address"
        placeholder="email@example.com"
        as={isEditing ? 'span' : 'a'}
        href={!isEditing ? `mailto:${header.email}` : undefined}
      />
    );
  }
  if (showItem('contact-linkedin')) {
    contactElements.push(
      <EditableText
        key="linkedin"
        value={header.linkedin}
        onChange={(val) => updateHeader('linkedin', val)}
        isEditing={isEditing}
        label="LinkedIn Profile"
        placeholder="linkedin.com/in/username"
        as={isEditing ? 'span' : 'a'}
        href={!isEditing ? (header.linkedinUrl || `https://${header.linkedin}`) : undefined}
        target={!isEditing ? '_blank' : undefined}
        rel={!isEditing ? 'noopener noreferrer' : undefined}
      />
    );
  }
  if (showItem('contact-github')) {
    contactElements.push(
      <EditableText
        key="github"
        value={header.github || 'github.com/your-username'}
        onChange={(val) => updateHeader('github', val)}
        isEditing={isEditing}
        label="GitHub Profile"
        placeholder="github.com/username"
        as={isEditing ? 'span' : 'a'}
        href={!isEditing && header.github ? `https://${header.github.replace(/^https?:\/\//, '')}` : undefined}
        target={!isEditing ? '_blank' : undefined}
        rel={!isEditing ? 'noopener noreferrer' : undefined}
      />
    );
  }

  // Filtered items based on hiddenItems, sorted with latest on top
  const visibleExperience = (experience || [])
    .map((entry, idx) => ({ entry, idx }))
    .filter(({ entry, idx }) => showItem(entry.id || `exp-${idx}`))
    .sort((a, b) => compareExperience(a.entry, b.entry));

  const visibleEducation = (education || [])
    .map((entry, idx) => ({ entry, idx }))
    .filter(({ entry, idx }) => showItem(entry.id || `edu-${idx}`));

  const visibleCerts = (certifications || [])
    .map((cert, idx) => ({ cert, idx }))
    .filter(({ cert, idx }) => showItem(cert.id || `cert-${idx}`));

  const visibleCourses = (onlineCourses || [])
    .map((c, idx) => ({ c, idx }))
    .filter(({ c, idx }) => showItem(c.id || `oc-${idx}`));

  const visibleProjects = (projects || courseProjects || [])
    .map((p, idx) => ({ p, idx }))
    .filter(({ p, idx }) => showItem(p.id || `proj-${idx}`) && showItem(p.id || `cp-${idx}`));

  const visibleSkills = (skills || [])
    .map((s, idx) => ({ s, idx }))
    .filter(({ s, idx }) => showItem(s.id || `sk-${idx}`));

  return (
    <div
      className={`resume-page ${isEditing ? 'is-edit-mode' : ''}`}
      id="resumeDoc"
      style={{ '--resume-accent': accentColor }}
    >
      {/* ─── Header ─── */}
      <div className="r-header">
        <h1 className="r-header__name">
          <EditableText
            value={header.name}
            onChange={(val) => updateHeader('name', val)}
            isEditing={isEditing}
            label="Full Name"
            placeholder="Your Full Name"
            className="r-editable-title"
          />
        </h1>
        {contactElements.length > 0 && (
          <div className="r-header__contact">
            {contactElements.map((el, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="r-header__sep">|</span>}
                {el}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* ─── Summary ─── */}
      {showSection('summary') && (summary || isEditing) && (
        <section className="r-section">
          <h2 className="r-section__title">Summary</h2>
          <EditableText
            value={summary}
            onChange={updateSummary}
            isEditing={isEditing}
            label="Professional Summary"
            placeholder="Write a concise 2–3 sentence professional summary highlighting your core skills, years of experience, and main achievements..."
            multiline={true}
            as="p"
            className="r-summary"
          />
        </section>
      )}

      {/* ─── Experience ─── */}
      {showSection('experience') && (visibleExperience.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Experience</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addExperience}
                title="Add work experience"
              >
                <Plus size={13} /> Add Role
              </button>
            )}
          </div>

          {visibleExperience.map(({ entry, idx: expIdx }) => (
            <article className={`r-entry ${isEditing ? 'is-entry-editing' : ''}`} key={entry.id || expIdx}>
              {isEditing && (
                <div className="entry-hover-bar">
                  <span className="entry-tag">Role #{expIdx + 1}</span>
                  <button
                    type="button"
                    className="btn-delete-entry"
                    onClick={() => deleteExpEntry(entry.id || expIdx)}
                    title="Delete this role"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}

              <div className="r-entry__head">
                <div className="r-entry__title">
                  <EditableText
                    value={entry.role}
                    onChange={(val) => updateExpField(entry.id || expIdx, 'role', val)}
                    isEditing={isEditing}
                    label="Role Title"
                    placeholder="Job Title"
                    className="font-bold"
                  />
                  {(entry.company || isEditing) && (
                    <>
                      <span className="r-sep"> | </span>
                      <EditableText
                        value={entry.company}
                        onChange={(val) => updateExpField(entry.id || expIdx, 'company', val)}
                        isEditing={isEditing}
                        label="Company Name"
                        placeholder="Company Name"
                        className="r-company"
                      />
                    </>
                  )}
                  {(entry.location || isEditing) && (
                    <>
                      <span className="r-sep"> | </span>
                      <EditableText
                        value={entry.location}
                        onChange={(val) => updateExpField(entry.id || expIdx, 'location', val)}
                        isEditing={isEditing}
                        label="Location"
                        placeholder="City, State"
                        className="r-location"
                      />
                    </>
                  )}
                </div>

                <div className="r-entry__sub r-period-sub">
                  <EditableText
                    value={entry.startDate !== undefined ? entry.startDate : (entry.period ? entry.period.split(/[–-]/)[0]?.trim() : '')}
                    onChange={(val) => updateExpField(entry.id || expIdx, 'startDate', val)}
                    isEditing={isEditing}
                    label="Start Date (e.g. May 2024)"
                    placeholder="Start Date"
                  />
                  <span className="r-period-sep"> – </span>
                  <EditableText
                    value={entry.endDate !== undefined ? entry.endDate : (entry.period ? entry.period.split(/[–-]/)[1]?.trim() : '')}
                    onChange={(val) => updateExpField(entry.id || expIdx, 'endDate', val)}
                    isEditing={isEditing}
                    label="End Date (e.g. Present or Aug 2023)"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Bullets */}
              {(entry.bullets.length > 0 || isEditing) && (
                <ul className="r-bullets">
                  {entry.bullets.map((b, bulletIdx) => (
                    <li key={b.id || bulletIdx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, `experience-bullets:${entry.id || expIdx}`, b.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                      <span className="bullet-content">
                        {(b.highlight || isEditing) && (
                          <>
                            <EditableText
                            value={b.highlight}
                            onChange={(val) => updateExpBullet(entry.id || expIdx, bulletIdx, 'highlight', val)}
                            isEditing={isEditing}
                            label="Key Highlight / Project"
                            placeholder="Key Achievement:"
                            as="strong"
                            className="mr-1"
                            />
                            {' '}
                          </>
                        )}
                        <EditableText
                          value={b.text}
                          onChange={(val) => updateExpBullet(entry.id || expIdx, bulletIdx, 'text', val)}
                          isEditing={isEditing}
                          label="Bullet Description"
                          placeholder="Describe your accomplishment..."
                          multiline={true}
                        />
                      </span>

                      {isEditing && (
                        <span className="bullet-actions">
                          <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, `experience-bullets:${entry.id || expIdx}`, b.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                          <button
                            type="button"
                            className="btn-move-bullet"
                            onClick={() => moveExpBullet(entry.id || expIdx, bulletIdx, -1)}
                            disabled={bulletIdx === 0}
                            title="Move up"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-move-bullet"
                            onClick={() => moveExpBullet(entry.id || expIdx, bulletIdx, 1)}
                            disabled={bulletIdx === entry.bullets.length - 1}
                            title="Move down"
                          >
                            <ChevronDown size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-del-bullet"
                            onClick={() => deleteExpBullet(entry.id || expIdx, bulletIdx)}
                            title="Delete bullet"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li className="bullet-add-row">
                      <button
                        type="button"
                        className="btn-add-bullet"
                        onClick={() => addExpBullet(entry.id || expIdx)}
                      >
                        <Plus size={12} /> Add bullet point
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ─── Education ─── */}
      {showSection('education') && (visibleEducation.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Education</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addEducation}
                title="Add education entry"
              >
                <Plus size={13} /> Add School
              </button>
            )}
          </div>

          {visibleEducation.map(({ entry, idx: eduIdx }) => (
            <article className={`r-entry ${isEditing ? 'is-entry-editing' : ''}`} key={entry.id || eduIdx}>
              {isEditing && (
                <div className="entry-hover-bar">
                  <span className="entry-tag">Education #{eduIdx + 1}</span>
                  <button
                    type="button"
                    className="btn-delete-entry"
                    onClick={() => deleteEduEntry(eduIdx)}
                    title="Delete this education"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}

              <div className="r-entry__head">
                <div className="r-entry__title">
                  <EditableText
                    value={entry.degree}
                    onChange={(val) => updateEduField(eduIdx, 'degree', val)}
                    isEditing={isEditing}
                    label="Degree Title"
                    placeholder="Degree / Major"
                    className="font-bold"
                  />
                </div>
                <div className="r-entry__sub">
                  <EditableText
                    value={entry.institution}
                    onChange={(val) => updateEduField(eduIdx, 'institution', val)}
                    isEditing={isEditing}
                    label="Institution / University"
                    placeholder="University / College"
                  />
                  {(entry.location || isEditing) && (
                    <>
                      <span className="r-sep"> | </span>
                      <EditableText
                        value={entry.location}
                        onChange={(val) => updateEduField(eduIdx, 'location', val)}
                        isEditing={isEditing}
                        label="Location"
                        placeholder="City, State"
                      />
                    </>
                  )}
                </div>
                {(entry.graduationDate || isEditing) && (
                  <div className="r-entry__sub r-grad-sub">
                    <EditableText
                      value={entry.gradStatus || 'Graduated'}
                      onChange={(val) => updateEduField(eduIdx, 'gradStatus', val)}
                      isEditing={isEditing}
                      label="Graduation Status (Click to edit: Graduated / Target Graduation)"
                      placeholder="Graduated"
                      className="r-grad-status"
                    />
                    <span className="r-grad-colon">: </span>
                    <EditableText
                      value={entry.graduationDate}
                      onChange={(val) => updateEduField(eduIdx, 'graduationDate', val)}
                      isEditing={isEditing}
                      label="Graduation Date"
                      placeholder="Graduation Year / Date"
                    />

                    {isEditing && (
                      <button
                        type="button"
                        className="btn-grad-toggle"
                        onClick={() => {
                          const current = entry.gradStatus || 'Graduated';
                          const next = current.toLowerCase().includes('target')
                            ? 'Graduated'
                            : 'Target Graduation';
                          updateEduField(eduIdx, 'gradStatus', next);
                        }}
                        title={`Click to switch to "${(entry.gradStatus || 'Graduated').toLowerCase().includes('target') ? 'Graduated' : 'Target Graduation'}"`}
                      >
                        <RotateCcw size={10} />
                        <span>{(entry.gradStatus || 'Graduated').toLowerCase().includes('target') ? 'Set "Graduated"' : 'Set "Target Graduation"'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {(entry.bullets?.length > 0 || isEditing) && (
                <ul className="r-bullets">
                  {entry.bullets?.map((b, bulletIdx) => (
                    <li key={b.id || bulletIdx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, `education-bullets:${entry.id || eduIdx}`, b.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                      <span className="bullet-content">
                        {(b.highlight || isEditing) && (
                          <>
                            <EditableText
                            value={b.highlight}
                            onChange={(val) => updateEduBullet(eduIdx, bulletIdx, 'highlight', val)}
                            isEditing={isEditing}
                            label="Coursework / Honors"
                            placeholder="Highlight:"
                            as="strong"
                            className="mr-1"
                            />
                            {' '}
                          </>
                        )}
                        <EditableText
                          value={b.text}
                          onChange={(val) => updateEduBullet(eduIdx, bulletIdx, 'text', val)}
                          isEditing={isEditing}
                          label="Description"
                          placeholder="Honors, coursework, or achievements..."
                        />
                      </span>

                      {isEditing && (
                        <span className="bullet-actions">
                          <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, `education-bullets:${entry.id || eduIdx}`, b.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                          <button
                            type="button"
                            className="btn-move-bullet"
                            onClick={() => moveEduBullet(eduIdx, bulletIdx, -1)}
                            disabled={bulletIdx === 0}
                            title="Move up"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-move-bullet"
                            onClick={() => moveEduBullet(eduIdx, bulletIdx, 1)}
                            disabled={bulletIdx === entry.bullets.length - 1}
                            title="Move down"
                          >
                            <ChevronDown size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-del-bullet"
                            onClick={() => deleteEduBullet(eduIdx, bulletIdx)}
                            title="Delete bullet"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                    </li>
                  ))}

                  {isEditing && (
                    <li className="bullet-add-row">
                      <button
                        type="button"
                        className="btn-add-bullet"
                        onClick={() => addEduBullet(eduIdx)}
                      >
                        <Plus size={12} /> Add bullet point
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {/* ─── Certifications ─── */}
      {showSection('certifications') && (visibleCerts.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Certifications</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addCert}
                title="Add certification"
              >
                <Plus size={13} /> Add Certification
              </button>
            )}
          </div>

          <ul className="r-bullets">
            {visibleCerts.map(({ cert, idx }) => (
              <li key={cert.id || idx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'certifications', cert.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                <span className="bullet-content">
                  <EditableText
                    value={cert.name}
                    onChange={(val) => updateCertField(idx, 'name', val)}
                    isEditing={isEditing}
                    label="Certification Name"
                    placeholder="Certification Title"
                    as="strong"
                  />
                  {(cert.issuer || isEditing) && (
                    <>
                      <span className="r-sep"> – </span>
                      <EditableText
                        value={cert.issuer}
                        onChange={(val) => updateCertField(idx, 'issuer', val)}
                        isEditing={isEditing}
                        label="Issuing Organization"
                        placeholder="Issuing Organization"
                      />
                    </>
                  )}
                  {(cert.date || isEditing) && (
                    <>
                      <span className="r-sep"> (</span>
                      <EditableText
                        value={cert.date}
                        onChange={(val) => updateCertField(idx, 'date', val)}
                        isEditing={isEditing}
                        label="Year / Date"
                        placeholder="Year"
                      />
                      <span className="r-sep">)</span>
                    </>
                  )}
                </span>

                {isEditing && (
                  <span className="bullet-actions">
                    <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, 'certifications', cert.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveCert(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveCert(idx, 1)}
                      disabled={idx === visibleCerts.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-del-bullet"
                      onClick={() => deleteCert(idx)}
                      title="Delete certification"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Online Courses ─── */}
      {showSection('onlineCourses') && (visibleCourses.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Online Courses</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addCourse}
                title="Add online course"
              >
                <Plus size={13} /> Add Course
              </button>
            )}
          </div>

          <ul className="r-bullets">
            {visibleCourses.map(({ c, idx }) => (
              <li key={c.id || idx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'onlineCourses', c.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                <span className="bullet-content">
                  <EditableText
                    value={c.text}
                    onChange={(val) => updateCourse(idx, val)}
                    isEditing={isEditing}
                    label="Course Title & Platform"
                    placeholder="Course Name – Issuing Organization or Platform"
                  />
                </span>

                {isEditing && (
                  <span className="bullet-actions">
                    <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, 'onlineCourses', c.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveCourse(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveCourse(idx, 1)}
                      disabled={idx === visibleCourses.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-del-bullet"
                      onClick={() => deleteCourse(idx)}
                      title="Delete course"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Projects ─── */}
      {showSection('projects') && showSection('courseProjects') && (visibleProjects.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Projects</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addProject}
                title="Add project"
              >
                <Plus size={13} /> Add Project
              </button>
            )}
          </div>

          <ul className="r-bullets">
            {visibleProjects.map(({ p, idx }) => (
              <li key={p.id || idx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'projects', p.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                <span className="bullet-content">
                  <EditableText
                    value={p.highlight}
                    onChange={(val) => updateProjectField(idx, 'highlight', val)}
                    isEditing={isEditing}
                    label="Project Title"
                    placeholder="Project Name"
                    as="strong"
                    className="mr-1"
                  />
                  <span className="r-sep">{p.separator || ' – '}</span>
                  <EditableText
                    value={p.text}
                    onChange={(val) => updateProjectField(idx, 'text', val)}
                    isEditing={isEditing}
                    label="Project Description & Tech Stack"
                    placeholder="Project description, architecture, and results..."
                  />
                </span>

                {isEditing && (
                  <span className="bullet-actions">
                    <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, 'projects', p.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveProject(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveProject(idx, 1)}
                      disabled={idx === visibleProjects.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-del-bullet"
                      onClick={() => deleteProject(idx)}
                      title="Delete project"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Skills ─── */}
      {showSection('skills') && (visibleSkills.length > 0 || isEditing) && (
        <section className="r-section">
          <div className="r-section__header-row">
            <h2 className="r-section__title">Skills</h2>
            {isEditing && (
              <button
                type="button"
                className="btn-add-inline"
                onClick={addSkill}
                title="Add skill category"
              >
                <Plus size={13} /> Add Category
              </button>
            )}
          </div>

          <ul className="r-bullets">
            {visibleSkills.map(({ s, idx }) => (
              <li key={s.id || idx} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, 'skills', s.id)} className={isEditing ? 'is-bullet-editing' : ''}>
                <span className="bullet-content">
                  <EditableText
                    value={s.category}
                    onChange={(val) => updateSkillField(idx, 'category', val)}
                    isEditing={isEditing}
                    label="Skill Category"
                    placeholder="Category Name:"
                    as="strong"
                    className="mr-1"
                  />
                  {' '}
                  <EditableText
                    value={s.text}
                    onChange={(val) => updateSkillField(idx, 'text', val)}
                    isEditing={isEditing}
                    label="Skills List"
                    placeholder="List of technologies, frameworks, and languages..."
                  />
                </span>

                {isEditing && (
                  <span className="bullet-actions">
                    <span className="bullet-drag-handle" draggable={true} onDragStart={(event) => handleDragStart(event, 'skills', s.id)} onDragEnd={handleDragEnd} title="Drag to reorder">⋮⋮</span>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveSkill(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-move-bullet"
                      onClick={() => moveSkill(idx, 1)}
                      disabled={idx === visibleSkills.length - 1}
                      title="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-del-bullet"
                      onClick={() => deleteSkill(idx)}
                      title="Delete skill"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
