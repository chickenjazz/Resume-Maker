# React Resume Template

A modern, ATS-friendly, modular React resume template matching the visual design and typography of the provided PDF.

## 🚀 Getting Started

To run the development server with live reload:

```bash
npm run dev
```

Then open your browser at `http://localhost:3000` (or the port displayed in your terminal).

To build the production bundle:

```bash
npm run build
```

---

## 🛠 Features

1. **Modular Components:**
   - [`ResumeHeader.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/ResumeHeader.jsx) — Name, contact details, links.
   - [`SummarySection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/SummarySection.jsx) — Executive summary.
   - [`ExperienceSection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/ExperienceSection.jsx) — Work history with bullet points and bold highlights.
   - [`EducationSection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/EducationSection.jsx) — Degrees, honors, and coursework.
   - [`OnlineCoursesSection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/OnlineCoursesSection.jsx) — Certifications and online specializations.
   - [`CourseProjectsSection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/CourseProjectsSection.jsx) — Key projects and descriptions.
   - [`SkillsSection.jsx`](file:///c:/Users/justi/Documents/Resume/Templates/src/components/SkillsSection.jsx) — Categorized skills list.

2. **How to Add Your Information:**
   - **Method 1 (In the Browser):** Click **✏️ Edit Resume** in the top toolbar to edit fields, add or remove jobs/education/bullets dynamically. Edits auto-save to `localStorage`.
   - **Method 2 (In Code):** Update [`src/data/resumeData.js`](file:///c:/Users/justi/Documents/Resume/Templates/src/data/resumeData.js). All resume content is neatly structured in this single file.
   - **Method 3 (JSON Import/Export):** Use **📥 Export JSON** to save your resume content as a file, and **📤 Import JSON** to load it back anytime.

3. **Print & PDF Export:**
   - Click **🖨️ Print / Save as PDF** (or press `Ctrl + P`).
   - The toolbar is automatically hidden, page margins are formatted for US Letter size, and colors print accurately.
