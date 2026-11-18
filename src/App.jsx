import React, { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { initialResumeData } from './data/resumeData';
import AppHeader from './components/AppHeader';
import EditorPanel from './components/EditorPanel';
import ResumePreview from './components/ResumePreview';
import AppModal from './components/AppModal';
import NotFoundPage from './components/NotFoundPage';
import Dither from './components/Dither';
import JobStickers from './components/JobStickers';

const STORAGE_KEY = 'react_resume_data_v3';

export default function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  if (currentPath !== '/' && currentPath !== '/index.html') {
    return <NotFoundPage />;
  }

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.theme?.accent?.toLowerCase() === '#153b6b') {
          parsed.theme = { ...parsed.theme, accent: '#9a3412' };
        }
        return parsed;
      }
    } catch (e) { /* ignore */ }
    return initialResumeData;
  });

  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState(null);
  const previewRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    } catch (e) { /* ignore */ }
  }, [data]);

  // Dynamic page title
  useEffect(() => {
    const name = data?.header?.name;
    if (name && !name.startsWith('[')) {
      document.title = `${name} – Resume`;
    } else {
      document.title = 'elCVate – Resume Builder';
    }
  }, [data?.header?.name]);

  // Keep the mobile sidebar easy to dismiss without taking focus away from the editor.
  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Execute clean print without header title, URL, or edit artifacts
  const handlePrint = useCallback(() => {
    // Flush any currently focused contentEditable element
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    const wasEditing = isEditing;
    const originalTitle = document.title;

    // Switch to preview mode synchronously before print dialog opens
    flushSync(() => {
      setIsEditing(false);
    });

    // Temporarily clear page title so browser header doesn't print "elCVate"
    document.title = '';

    const restoreState = () => {
      document.title = originalTitle;
      if (wasEditing) {
        setIsEditing(true);
      }
      window.removeEventListener('afterprint', restoreState);
    };

    window.addEventListener('afterprint', restoreState);

    const executePrint = () => {
      window.print();
      // Fallback restore if afterprint doesn't fire
      setTimeout(restoreState, 500);
    };

    // Await document.fonts.ready to ensure target fonts are fully laid out before print engine captures the DOM
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(executePrint, 60);
      });
    } else {
      setTimeout(executePrint, 120);
    }
  }, [isEditing]);

  const handleReset = useCallback(() => {
    setModal({
      title: 'Reset resume?',
      message: 'All current edits will be lost and the default resume data will be restored.',
      confirmLabel: 'Reset Resume',
      cancelLabel: 'Keep Editing',
      onConfirm: () => {
      setData(initialResumeData);
      localStorage.removeItem(STORAGE_KEY);
      setModal(null);
      }
    });
  }, []);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.header.name || 'resume').replace(/\s+/g, '_')}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const handleImport = useCallback((importedData) => {
    if (importedData?.header) {
      setData(importedData);
    } else {
      setModal({
        title: 'Import failed',
        message: 'That file does not contain valid elCVate resume data.',
        confirmLabel: 'Close',
        onConfirm: () => setModal(null)
      });
    }
  }, []);

  // Quick add item to a specific section
  const handleAddItem = useCallback((sectionKey) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const now = Date.now();

      // Ensure section is not hidden
      if (copy.hiddenSections?.includes(sectionKey)) {
        copy.hiddenSections = copy.hiddenSections.filter(k => k !== sectionKey);
      }

      if (sectionKey === 'experience') {
        copy.experience.push({
          id: `exp-${now}`,
          role: 'Job Title',
          company: 'Company Name',
          location: 'City, State',
          startDate: 'Month Year',
          endDate: 'Present',
          period: 'Month Year – Present',
          bullets: [
            {
              id: `bullet-${now}`,
              highlight: 'Key Achievement:',
              text: 'Describe key accomplishment, metrics, and technologies used.'
            }
          ]
        });
      } else if (sectionKey === 'education') {
        copy.education.push({
          id: `edu-${now}`,
          degree: 'Degree / Certificate',
          institution: 'University / Institution',
          location: 'City, State',
          gradStatus: 'Graduated',
          graduationDate: 'Graduation Year',
          bullets: []
        });
      } else if (sectionKey === 'certifications') {
        if (!copy.certifications) copy.certifications = [];
        copy.certifications.push({
          id: `cert-${now}`,
          name: 'Certification Title',
          issuer: 'Issuing Organization',
          date: 'Year'
        });
      } else if (sectionKey === 'onlineCourses') {
        copy.onlineCourses.push({
          id: `course-${now}`,
          text: 'Course Name – Issuing Organization or Platform'
        });
      } else if (sectionKey === 'projects' || sectionKey === 'courseProjects') {
        if (!copy.projects) copy.projects = copy.courseProjects || [];
        copy.projects.push({
          id: `proj-${now}`,
          highlight: 'Project Title',
          separator: ' – ',
          text: 'Summary of features developed, architecture, and tech stack.'
        });
      } else if (sectionKey === 'skills') {
        copy.skills.push({
          id: `skill-${now}`,
          category: 'Category Name: ',
          text: 'Tools and technologies separated by commas'
        });
      }

      return copy;
    });
  }, []);

  return (
    <div className="app">
      <AppHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(e => !e)}
        onPrint={handlePrint}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        saved={saved}
        scrollTarget={previewRef}
      />

      <div className="app-body">
        {sidebarOpen && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close sections sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <EditorPanel
          data={data}
          setData={setData}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(e => !e)}
          isOpen={sidebarOpen}
          onAddItem={handleAddItem}
        />

        <div className="preview-workspace">
          <div className="preview-workspace__background" aria-hidden="true">
            <Dither
              waveColor="#f97316"
              backgroundColor="#efeae0"
              ditherMode="halftone"
              colorNum={4}
              pixelSize={2}
              waveSpeed={0.05}
              waveFrequency={3}
              waveAmplitude={0.3}
              mouseEffect="reveal"
              mouseRadius={0.3}
              contrast={1.3}
              palette={[]}
              dpr={1}
            />
          </div>
          <JobStickers scrollerRef={previewRef} />
          <main className="preview-area" ref={previewRef}>
            <ResumePreview
              data={data}
              setData={setData}
              isEditing={isEditing}
              onAddItem={handleAddItem}
            />
          </main>
        </div>
      </div>

      <footer className="app-footer">
        <span>elCVate</span>
        <span>Resume builder by jrm</span>
      </footer>

      {modal && (
        <AppModal
          title={modal.title}
          message={modal.message}
          confirmLabel={modal.confirmLabel}
          cancelLabel={modal.cancelLabel}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
