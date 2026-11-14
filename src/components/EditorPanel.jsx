import React, { useState } from 'react';
import {
  Eye, EyeOff, ChevronDown, ChevronRight,
  FileText, Briefcase, GraduationCap, Award,
  BookOpen, FolderKanban, Wrench, UserCheck, GripVertical, Trash2,
  Search, X
} from 'lucide-react';
import AppModal from './AppModal';

export default function EditorPanel({
  data,
  setData,
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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const accentColor = data.theme?.accent || '#153b6b';

  const setAccentColor = (accent) => {
    setData(prev => ({
      ...prev,
      theme: { ...(prev.theme || {}), accent }
    }));
  };

  const isSectionVisible = (key) => !hiddenSections.includes(key);
  const isItemVisible = (id) => !hiddenItems.includes(id);

  const deleteItem = (sectionKey, itemId) => {
    setDeleteTarget({ sectionKey, itemId });
  };

  const confirmDeleteItem = () => {
    if (!deleteTarget) return;
    const { sectionKey, itemId } = deleteTarget;
    setData(prev => {
      const next = { ...prev };
      const collectionKey = sectionKey === 'projects' ? (next.projects ? 'projects' : 'courseProjects') : sectionKey;
      if (Array.isArray(next[collectionKey])) {
        next[collectionKey] = next[collectionKey].filter(item => item.id !== itemId);
      }
      next.hiddenItems = (next.hiddenItems || []).filter(id => id !== itemId);
      return next;
    });
    setDeleteTarget(null);
  };

  const reorderItem = (sectionKey, sourceId, targetId) => {
    if (sourceId === targetId) return;
    setData(prev => {
      const next = { ...prev };
      const collectionKey = sectionKey === 'projects' ? (next.projects ? 'projects' : 'courseProjects') : sectionKey;
      const list = next[collectionKey];
      if (!Array.isArray(list)) return prev;
      const sourceIndex = list.findIndex(item => item.id === sourceId);
      const targetIndex = list.findIndex(item => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      next[collectionKey] = [...list];
      const [item] = next[collectionKey].splice(sourceIndex, 1);
      next[collectionKey].splice(targetIndex, 0, item);
      return next;
    });
  };

  const handleItemDragStart = (event, sectionKey, itemId) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ sectionKey, itemId }));
    event.currentTarget.classList.add('is-dragging');
  };

  const handleItemDrop = (event, sectionKey, targetId) => {
    event.preventDefault();
    try {
      const source = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (source.sectionKey === sectionKey) reorderItem(sectionKey, source.itemId, targetId);
    } catch { /* Ignore unrelated drops. */ }
  };

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
        { id: 'contact-github', label: 'GitHub', preview: data.header?.github || 'github.com/your-username' },
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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const totalItems = sectionsConfig.reduce((count, section) => count + section.items.length, 0);
  const visibleItems = sectionsConfig.reduce(
    (count, section) => count + section.items.filter(item => isItemVisible(item.id)).length,
    0
  );
  const searchHasResults = !normalizedSearch || sectionsConfig.some(section => (
    section.label.toLowerCase().includes(normalizedSearch) || section.items.some(item => (
      `${item.label || ''} ${item.sub || ''} ${item.preview || ''}`.toLowerCase().includes(normalizedSearch)
    ))
  ));

  return (
    <aside
      id="editor-sidebar"
      className={`editor-sidebar ${isOpen ? 'open' : ''}`}
      aria-label="Resume sections"
      aria-hidden={!isOpen}
    >
      <div className="sidebar-header">
        <div className="sidebar-header__info">
          <h2 className="sidebar-title">
            <Eye size={18} />
            Sections
          </h2>
          <span className="sidebar-header__summary">
            {visibleItems} of {totalItems} items visible
          </span>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="sidebar-actions-bar">
        <span className="sidebar-actions-bar__label">Manage visibility</span>
        <button className="btn-link" onClick={showAll} disabled={hiddenSections.length === 0 && hiddenItems.length === 0}>
          Show all
        </button>
      </div>

      <div className="sidebar-search">
        <Search size={15} aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Find a section or item"
          aria-label="Find a resume section or item"
        />
        {searchQuery && (
          <button
            type="button"
            className="sidebar-search__clear"
            onClick={() => setSearchQuery('')}
            aria-label="Clear section search"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="sidebar-color-card" style={{ '--swatch-color': accentColor }}>
        <div className="sidebar-color-card__top">
          <label
            className="sidebar-color-swatch"
            style={{ '--swatch-color': accentColor }}
            title="Choose accent color"
          >
            <input
              type="color"
              value={accentColor}
              aria-label="Choose resume accent color"
              onChange={(event) => setAccentColor(event.target.value)}
            />
          </label>
          <div className="sidebar-color-card__copy">
            <span className="sidebar-color-card__eyebrow">Accent</span>
            <strong className="sidebar-color-card__value">{accentColor.toUpperCase()}</strong>
          </div>
        </div>
        <div className="sidebar-color-presets" aria-label="Resume color presets">
          {['#153b6b', '#2563eb', '#222222', '#6b1f2b', '#1f5b4d', '#5b4636'].map(color => (
            <button
              key={color}
              type="button"
              className={`color-preset ${accentColor.toLowerCase() === color ? 'is-selected' : ''}`}
              style={{ '--preset-color': color }}
              aria-label={`Use ${color}`}
              title={color}
              onClick={() => setAccentColor(color)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      {/* Sections and Items List */}
      <div className="sidebar-sections-list">
        {sectionsConfig.map(({ key, label, icon: Icon, items, isAlwaysSection }) => {
          const sectionMatches = label.toLowerCase().includes(normalizedSearch);
          const matchingItems = normalizedSearch && !sectionMatches
            ? items.filter(item => `${item.label || ''} ${item.sub || ''} ${item.preview || ''}`.toLowerCase().includes(normalizedSearch))
            : items;
          if (normalizedSearch && !sectionMatches && matchingItems.length === 0) return null;

          const sectionVisible = isAlwaysSection || isSectionVisible(key);
          const isExpanded = expandedSections[key];
          const hasItems = matchingItems.length > 0;
          const shouldExpand = isExpanded || Boolean(normalizedSearch);

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
                        {matchingItems.filter(it => isItemVisible(it.id)).length} of {matchingItems.length} visible
                      </span>
                    )}
                  </div>
                  {hasItems && (
                    <span className="accordion-arrow">
                      {shouldExpand ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
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
              {sectionVisible && hasItems && shouldExpand && (
                <div className="item-toggle-list">
                  {matchingItems.map((item) => {
                    const itemActive = isItemVisible(item.id);
                    return (
                      <div
                        key={item.id}
                        draggable={key !== 'contact'}
                        onDragStart={(event) => handleItemDragStart(event, key, item.id)}
                        onDragEnd={(event) => event.currentTarget.classList.remove('is-dragging')}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => handleItemDrop(event, key, item.id)}
                        className={`item-toggle-row ${itemActive ? 'is-active' : 'is-muted'}`}
                        onClick={() => toggleItem(item.id)}
                        title={`Click to ${itemActive ? 'hide' : 'show'} this item`}
                      >
                        {key !== 'contact' && <GripVertical className="item-drag-handle" size={14} aria-label="Drag to reorder" />}
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
                        {key !== 'contact' && (
                          <button
                            type="button"
                            className="btn-item-delete"
                            aria-label="Delete item"
                            title="Delete item"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(key, item.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {normalizedSearch && !searchHasResults && (
          <div className="sidebar-empty-search">
            <Search size={16} aria-hidden="true" />
            <strong>No matches</strong>
            <span>Try a section name, company, or skill.</span>
          </div>
        )}
      </div>

      {deleteTarget && (
        <AppModal
          title="Delete item?"
          message="This item will be permanently removed from your resume."
          confirmLabel="Delete Item"
          confirmClassName="btn--danger-solid"
          cancelLabel="Cancel"
          onConfirm={confirmDeleteItem}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </aside>
  );
}
