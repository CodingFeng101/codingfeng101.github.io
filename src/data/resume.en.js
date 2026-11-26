// 英文版内容：只写需要翻译的字段，其余（链接、图片、视频、配色、印章等）沿用 resume.js。
// 按 id / key / marker 对应到中文版的条目。印章、竖排古诗、章名大字属于装饰，英文版也保留中文。

export const profileEn = {
  name: "Feng Guodong",
  eyebrow: "AI Applications · Full-Stack · Knowledge Graphs",
  headline: ["I study problems,", "and turn the", "answers", "into products"],
  headlineMark: "answers",
  intro: "I work on knowledge graphs, AI agents and editable creative tools — starting from research questions, then building the systems and polishing the products.",
  pageTitle: "Feng Guodong | AI Applications & Knowledge Graphs",
  description: "Feng Guodong's resume: AI application development, knowledge graphs, AI agents and editable creative tools.",
  location: "Nanchang, Jiangxi",
};

export const proseEn = {
  text: "I believe good research asks better questions, and good engineering ships better answers. So I move back and forth between knowledge graphs, AI agents and editable creation — making complex knowledge something you can search and understand, and also keep editing and building on.",
  marks: ["knowledge graphs", "AI agents", "editable creation"],
};

// name：导航与书眉用的英文名；short：手机导航与左侧刻度尺用的短名
export const chaptersEn = {
  works: {
    numeral: "Chapter One", name: "Works", short: "Works",
    epigraph: "Turning an idea into something other people can use.",
    from: "Liu Yuxi",
  },
  research: {
    numeral: "Chapter Two", name: "Research", short: "Papers",
    epigraph: "Ask the right question first, and the answer has a place to land.",
    from: "Qu Yuan",
  },
  experience: {
    numeral: "Chapter Three", name: "Experience", short: "Career",
    epigraph: "Research steps off the page and into real business.",
    from: "Lu You",
  },
  education: {
    numeral: "Chapter Four", name: "Education", short: "Study",
    epigraph: "Everything that came later started here.",
    from: "Zhu Xi",
  },
  letter: { numeral: "Chapter Five", name: "Contact", short: "Contact", epigraph: "Dear reader," },
};

export const heroShotsEn = {
  topRight: { label: "CanvasAnvil · Interior design" },
  bottomLeft: { label: "CanvasAnvil · Diagrams" },
  bottomRight: { label: "Slide Alchemy · Editable" },
};

export const projectsEn = {
  unigraph: {
    subtitle: "All-in-one knowledge graph platform",
    role: "Full-stack contributor",
    note: "From a paragraph of text to a graph that answers questions.",
    links: { 开源: "Source", 使用: "Live" },
    copy: [
      "Worked across the whole pipeline: raw text to graph index, context building and question answering.",
      "Built the offline indexes for entities, relations, data sources and community reports that online retrieval relies on.",
      "Implemented entity-attribute embeddings and similarity matching to map key entities in a question onto graph nodes.",
      "Contributed to the graph QA API and multi-dimensional context reranking, making answers more relevant and explainable.",
    ],
    imageAlt: "UniGraph platform sign-in page",
    caption: "UniGraph · Demo video",
    stillCaption: "UniGraph · Live version",
  },
  canvasanvil: {
    subtitle: "Multi-canvas AI creation platform",
    role: "Solo developer",
    note: "Circle it, change only that.",
    links: { 开源: "Source", 使用: "Live" },
    copy: [
      "Built a multi-canvas AI creation platform for flowcharts, interior design, slides, posters and infographics, on my own.",
      "Made the multi-canvas workspace with React, TypeScript and Vite: generate, edit regions, preview and export.",
      "Wrapped a unified API service on Node / Express covering model config, file parsing, slide generation and logging.",
      "Designed a unified model-calling layer and a set of AI Skills that take text, reference images, masks and multi-image input.",
    ],
    stackMap: { 多模态: "Multimodal" },
    imageAlt: "CanvasAnvil portal showing the multi-canvas workspace with diagram, interior design and slide entries",
    caption: "CanvasAnvil · Demo video",
    stillCaption: "CanvasAnvil · Portal",
  },
  "slide-alchemy": {
    subtitle: "Skill that rebuilds image-based slides as editable PPTX",
    period: "2026.06 — now",
    role: "Project lead / open-source author",
    note: "Editable is what makes it actually useful.",
    links: { 开源: "Source" },
    copy: [
      "Designed and open-sourced a way to rebuild image-based PPTs, PPTX screenshots and scanned decks into editable files.",
      "Set up the pipeline: background rebuild, element splitting, text recognition, shape recovery, asset slicing and PPTX assembly.",
      "Wrote the Codex Skill spec covering page analysis, visual restoration, layout checks and result fixes.",
      "Restores title bars, cards, icons, lines and tables as real text boxes, shapes and separate image assets.",
    ],
    stackMap: { 图像处理: "Image processing" },
    caption: "Slide Alchemy · Demo video",
    stillCaption: "Drag the line: image on the left, editable on the right",
  },
};

export const papersEn = {
  A: {
    label: "TKDE · Major revision · Fifth author",
    summary: "Explores a Human–LLM collaborative workflow for designing domain knowledge graphs, combining automatic exploration with human feedback to make candidate schemas more complete and consistent.",
  },
  B: {
    label: "Knowledge-Based Systems · SCI Q1 · Submitted / under review · Fourth author",
    summary: "Studies knowledge graph completion guided by schemas with multi-level validation. Only the submission status is shown here; no acceptance or publication is claimed.",
  },
};

export const patentsEn = {
  C: {
    title: "A knowledge graph search method and system based on local semantics and global communities",
    summary: "Second inventor. Combines entity-attribute vector matching, multi-level community detection and multi-dimensional context building to make graph search more relevant and explainable.",
  },
  D: {
    title: "A dual-mode editing and consistent generation method, device and medium for interior design drawings",
    summary: "Second inventor. Local-patch / global-replace dual-mode editing for AI interior design, keeping drawings and bills of materials from the same source.",
  },
  E: {
    title: "An adaptive hierarchical community construction method, device and medium for medical knowledge graphs",
    summary: "",
  },
};

export const experiencesEn = {
  zhongcan: {
    company: "Jiangxi Zhongcan Interactive Technology Co., Ltd.",
    role: "AI Agent Developer Intern",
    details: [
      "Built agent systems for vertical business scenarios, designing features around sales scripts, user needs and task flows.",
      "Turned the sales-script knowledge base into a knowledge graph and tuned knowledge matching, recall and supporting context.",
      "Developed and optimized agents for number selection, outreach and requirement translation, plus a multi-agent framework.",
    ],
  },
  "jiangxi-telecom": {
    company: "Jiangxi Telecom Information Industry Co., Ltd.",
    role: "AI Agent Developer Intern",
    details: [
      "Designed and built the end-to-end knowledge graph modules of an education resource recommender, organizing, linking and retrieving teaching knowledge.",
      "Brought the RAG retrieval pipeline into production, supporting course recommendations and subject Q&A.",
    ],
  },
};

export const educationEn = {
  "edu-1": {
    school: "Jiangxi Normal University",
    major: "Computer Science and Technology (Teacher Education)",
    note: "Average score 82",
  },
};

export const honorsEn = [
  "Software Designer certificate (national intermediate level)",
  "Second-class Scholarship for overall performance",
  "Provincial second prize, “Challenge Cup” Entrepreneurship Plan Competition",
  "Provincial second prize, “CCB Cup” Jiangxi Innovation Competition",
];

export const letterEn = {
  greeting: "Dear reader,",
  body: [
    "Thank you for reading this far.",
    "Research helps us ask better questions; engineering helps us ship better answers.",
    "If you're working on something interesting and want to talk, write to me any time.",
  ],
};
