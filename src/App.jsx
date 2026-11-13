import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { initialResumeData } from './data/resumeData';
import AppHeader from './components/AppHeader';
import EditorPanel from './components/EditorPanel';
import ResumePreview from './components/ResumePreview';

const STORAGE_KEY = 'react_resume_data_v3';

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return initialResumeData;
  });

  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);

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
      document.title = 'elCVate';
    }
  }, [data?.header?.name]);

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
    if (confirm('Reset to the default template? All edits will be lost.')) {
      setData(initialResumeData);
      localStorage.removeItem(STORAGE_KEY);
    }
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
      alert('Invalid resume data file.');
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
      />

      <div className="app-body">
        <EditorPanel
          data={data}
          setData={setData}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(e => !e)}
          isOpen={sidebarOpen}
          onAddItem={handleAddItem}
        />

        <main className="preview-area">
          <ResumePreview
            data={data}
            setData={setData}
            isEditing={isEditing}
            onAddItem={handleAddItem}
          />
        </main>
      </div>
    </div>
  );
}
