import React, { useState } from 'react';
import {
  Eye, EyeOff, ChevronDown, ChevronRight,
  FileText, Briefcase, GraduationCap, Award,
  BookOpen, FolderKanban, Wrench, Edit3, UserCheck
} from 'lucide-react';

export default function EditorPanel({
  data,
  setData,
  isEditing,
  onToggleEdit,
  isOpen
}) {
  const hiddenSections = data.hiddenSections || [];
  const hiddenItems = data.hiddenItems || [];

  // Track accordion expand/collapse state for sections
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    experience: true,
    education: true,
    certifications: true,
    onlineCourses: true,
    projects: true,
    skills: true
  });

  const toggleAccordion = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (key) => {
    setData(prev => {
      const current = prev.hiddenSections || [];
      const updated = current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key];
      return { ...prev, hiddenSections: updated };
    });
  };

  const toggleItem = (itemId) => {
    setData(prev => {
      const current = prev.hiddenItems || [];
      const updated = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      return { ...prev, hiddenItems: updated };
    });
  };

  const showAll = () => {
    setData(prev => ({
      ...prev,
      hiddenSections: [],
      hiddenItems: []
    }));
  };

  const isSectionVisible = (key) => !hiddenSections.includes(key);
  const isItemVisible = (id) => !hiddenItems.includes(id);

  // Sections configuration
  const sectionsConfig = [
    {
      key: 'contact',
      label: 'Contact Info',
      icon: UserCheck,
      isAlwaysSection: true,
      items: [
        { id: 'contact-location', label: 'Location', preview: data.header?.location },
        { id: 'contact-phone', label: 'Phone', preview: data.header?.phone },
        { id: 'contact-email', label: 'Email', preview: data.header?.email },
        { id: 'contact-linkedin', label: 'LinkedIn', preview: data.header?.linkedin },
      ]
    },
    {
      key: 'summary',
      label: 'Summary',
      icon: FileText,
      items: []
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: Briefcase,
      items: (data.experience || []).map((exp, idx) => ({
        id: exp.id || `exp-${idx}`,
        sub: (() => {
          const p = (exp.startDate && exp.endDate) ? `${exp.startDate} – ${exp.endDate}` : (exp.startDate || exp.period || '');
          return exp.company ? (p ? `${exp.company} • ${p}` : exp.company) : p;
        })()
      }))
    },
    {
      key: 'education',
      label: 'Education',
      icon: GraduationCap,
      items: (data.education || []).map((edu, idx) => ({
        id: edu.id || `edu-${idx}`,
        label: edu.degree || edu.institution || `Education #${idx + 1}`,
        sub: edu.institution
      }))
    },
    {
      key: 'certifications',
      label: 'Certifications & Training',
      icon: Award,
      items: (data.certifications || []).map((cert, idx) => ({
        id: cert.id || `cert-${idx}`,
        label: cert.name || `Certification #${idx + 1}`,
        sub: cert.issuer ? `${cert.issuer}${cert.date ? ` (${cert.date})` : ''}` : cert.date || ''
      }))
    },
    {
      key: 'onlineCourses',
      label: 'Online Courses',
      icon: BookOpen,
      items: (data.onlineCourses || []).map((c, idx) => ({
        id: c.id || `oc-${idx}`,
        label: c.text || `Course #${idx + 1}`
      }))
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      items: (data.projects || data.courseProjects || []).map((p, idx) => ({
        id: p.id || `cp-${idx}`,
        label: p.highlight || `Project #${idx + 1}`,
        sub: p.text ? `${p.text.slice(0, 45)}...` : ''
      }))
    },
    {
      key: 'skills',
      label: 'Skills',
      icon: Wrench,
      items: (data.skills || []).map((s, idx) => ({
        id: s.id || `sk-${idx}`,
        label: (s.category || `Category #${idx + 1}`).replace(/:$/, ''),
        sub: s.text ? `${s.text.slice(0, 40)}...` : ''
      }))
    }
  ];

  return (
    <aside className={`editor-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-header__info">
          <h2 className="sidebar-title">
            <Eye size={18} />
            Visibility Controls
          </h2>
          <p className="sidebar-subtitle">
            Toggle sections and specific individual items on or off.
          </p>
        </div>
      </div>

      {/* Edit Mode Status Banner */}
      <div className={`edit-mode-card ${isEditing ? 'is-active' : ''}`}>
        <div className="edit-mode-card__top">
          <div className="edit-mode-card__icon">
            <Edit3 size={18} />
          </div>
          <div className="edit-mode-card__text">
            <strong>{isEditing ? 'Editing' : 'Previewing'}</strong>
            <span>{isEditing ? 'Hover over fields to see labels. Click to edit.' : 'Click to edit in-place directly on resume.'}</span>
          </div>
        </div>
        <button
          className={`btn btn--sm ${isEditing ? 'btn--success' : 'btn--primary'} btn--full`}
          onClick={onToggleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Bulk actions */}
      <div className="sidebar-actions-bar">
        <button className="btn-link" onClick={showAll}>
          Show All Items
        </button>
      </div>

      {/* Sections and Items List */}
      <div className="sidebar-sections-list">
        {sectionsConfig.map(({ key, label, icon: Icon, items, isAlwaysSection }) => {
          const sectionVisible = isAlwaysSection || isSectionVisible(key);
          const isExpanded = expandedSections[key];
          const hasItems = items.length > 0;

          return (
            <div
              key={key}
              className={`section-toggle-card ${sectionVisible ? 'visible' : 'hidden'}`}
            >
              {/* Main Section Header */}
              <div className="section-toggle-card__main">
                <div
                  className="section-toggle-card__left clickable"
                  onClick={() => hasItems && toggleAccordion(key)}
                  title={hasItems ? 'Click to expand/collapse items' : undefined}
                >
                  <div className={`section-icon-badge ${sectionVisible ? 'active' : ''}`}>
                    <Icon size={15} />
                  </div>
                  <div className="section-meta">
                    <span className="section-label">{label}</span>
                    {hasItems && (
                      <span className="section-count">
                        {items.filter(it => isItemVisible(it.id)).length} of {items.length} visible
                      </span>
                    )}
                  </div>
                  {hasItems && (
                    <span className="accordion-arrow">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                  )}
                </div>

                {!isAlwaysSection && (
                  <label className="toggle-switch" title={`Toggle all of ${label}`}>
                    <input
                      type="checkbox"
                      checked={sectionVisible}
                      onChange={() => toggleSection(key)}
                    />
                    <span className="toggle-switch__slider" />
                  </label>
                )}
              </div>

              {/* Specific Items List */}
              {sectionVisible && hasItems && isExpanded && (
                <div className="item-toggle-list">
                  {items.map((item) => {
                    const itemActive = isItemVisible(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`item-toggle-row ${itemActive ? 'is-active' : 'is-muted'}`}
                        onClick={() => toggleItem(item.id)}
                        title={`Click to ${itemActive ? 'hide' : 'show'} this item`}
                      >
                        <div className="item-toggle-info">
                          <span className="item-toggle-label">{item.label}</span>
                          {item.sub && (
                            <span className="item-toggle-sub">{item.sub}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className={`btn-item-eye ${itemActive ? 'visible' : 'hidden'}`}
                          aria-label={itemActive ? 'Hide item' : 'Show item'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(item.id);
                          }}
                        >
                          {itemActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
