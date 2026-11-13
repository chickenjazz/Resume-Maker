export const initialResumeData = {
  theme: {
    accent: "#153b6b"
  },
  hiddenSections: [],
  hiddenItems: [],
  header: {
    name: "[First Name, Middle Initial, Last Name]",
    location: "City, State",
    phone: "[Phone Number]",
    email: "[EMAIL_ADDRESS]",
    linkedin: "linkedin.com/in/your-linkedin",
    linkedinUrl: "https://linkedin.com/in/your-linkedin",
    github: "github.com/your-username",
    githubUrl: "https://github.com/your-username"
  },
  summary: "Results-driven project and program manager with a background in cognitive psychology and data analysis, aligning with SynapseCo’s mission at the intersection of cognitive science and technology. Proven ability to lead end-to-end data-driven initiatives—from planning and timelines to execution and delivery—across healthcare, mental health, and remote work domains. Expertise in collaborating with cross-functional teams (developers, designers, QA), Agile project management (Jira, Trello), data analysis (Python, sentiment analysis), and stakeholder alignment. Adept at managing timelines, resources, and complex workflows to deliver actionable insights on time.",
  experience: [
    {
      id: "exp-1",
      role: "Research Coordinator",
      company: "Cognisco Labs",
      location: "New York, NY",
      startDate: "May 2024",
      endDate: "Present",
      period: "May 2024 – Present",
      bullets: [
        {
          id: "exp-1-b1",
          highlight: "Healthcare Industry Analysis Project:",
          text: "Conducted data collection, statistical analysis, and reporting on healthcare/mental health trends. Identified operational risks—including data inconsistencies and timeline delays—and implemented process improvements that reduced data errors by 20%. Delivered final stakeholder report on employment and supply-demand dynamics."
        },
        {
          id: "exp-1-b2",
          highlight: "SynapseFlow Cognitive Training App Launch:",
          text: "Defined content and technical scope for cognitive training app launch. Organized participant interactions and project meetings, tracking action items. Analyzed engagement via Google Analytics; created Gantt charts; delivered data-driven presentations and workshops to stakeholders."
        },
        {
          id: "exp-1-b3",
          highlight: "InsightEngine Customer Review Analysis:",
          text: "Collected 150+ customer reviews via Google Forms; performed sentiment analysis using Python and NLTK; produced clear project documentation and product recommendations."
        }
      ]
    },
    {
      id: "exp-2",
      role: "Program Management Intern",
      company: "Frisco Crisp Co",
      location: "Remote",
      startDate: "June 2023",
      endDate: "August 2023",
      period: "June 2023 – August 2023",
      bullets: [
        {
          id: "exp-2-b1",
          highlight: "",
          text: "Managed the planning, execution, and delivery of a data-driven customer insights initiative from concept to completion, leading a cross-functional team of data analysts, product managers, and marketers to analyze app usage patterns across 20,000+ users. Organized Agile stand-ups and sprint planning sessions, documenting key decisions and timelines in Jira."
        },
        {
          id: "exp-2-b2",
          highlight: "",
          text: "Oversaw 5 concurrent marketing campaigns, coordinating cross-functional teams. Applied Agile project management practices (daily stand-ups, sprint planning) using Jira. Proactively tracked timelines, identified risks, mitigated issues, and reduced campaign delays by 15%."
        }
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Cognitive Psychology",
      institution: "University of California, Irvine",
      location: "Irvine, CA",
      gradStatus: "Graduated",
      graduationDate: "December 2023",
      bullets: [
        {
          id: "edu-1-b1",
          highlight: "Relevant Coursework:",
          text: "Statistical Methods in Psychology, Data Analysis and Visualization, Research Methods, Human-Computer Interaction, Cognitive Science."
        },
        {
          id: "edu-1-b2",
          highlight: "Capstone Project:",
          text: "Conducted a study on the effects of digital media consumption on attention spans."
        },
        {
          id: "edu-1-b3",
          highlight: "Awards:",
          text: "Dean's Honor List (4 semesters), Psi Chi National Honor Society in Psychology."
        }
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Certified ScrumMaster (CSM)",
      issuer: "Scrum Alliance",
      date: "2024"
    }
  ],
  onlineCourses: [
    { id: "oc-1", text: "Machine Learning Specialization (Coursera)" },
    { id: "oc-2", text: "Google Data Analytics Professional Certificate (Coursera)" }
  ],
  projects: [
    {
      id: "proj-1",
      highlight: "Data Science Project: Multimodal Dog Emotion Classifier",
      separator: " – ",
      text: "Developed a dog emotion classifier app using a pre-trained multimodal, open-source model. Designed text prompts to analyze dog images and infer emotions and needs (e.g., “wants comfort”). Achieved 85% accuracy on a small test set; received top course grade."
    }
  ],
  skills: [
    {
      id: "sk-1",
      category: "Project & Operations Management:",
      text: "JIRA, Trello, Agile (sprint planning, daily stand-ups), Gantt charting, timeline and resource management, cross-functional collaboration, campaign management, performance tracking, and project documentation."
    },
    {
      id: "sk-2",
      category: "Data & Research:",
      text: "Data collection (Google Forms), research design, sentiment analysis, healthcare and mental health trend analysis."
    },
    {
      id: "sk-3",
      category: "Data Analysis & Visualization:",
      text: "Python (Pandas, NumPy, NLTK), statistical analysis, data cleaning, visualization (Tableau), sentiment analysis, multimodal model app development, prompt engineering, Hugging Face transformers library (open source AI models)."
    }
  ]
};
