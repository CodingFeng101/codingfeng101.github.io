// 简历的全部内容都在这个文件里。换成你自己的资料时，只改这里即可。
// 英文版的文字在 resume.en.js，改了这里的内容记得同步改那边对应的条目。
// 用【】包起来的是占位文字，页面上会以浅色虚线标出，填好后去掉【】即可。

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

// 演示视频作为附件放在本站仓库的 Release 里（tag 为 demo），不进 git 历史。
// 链接永久有效；视频还没上传或加载失败时，作品区会自动退回显示截图。
const releaseVideo = (file) => `https://github.com/CodingFeng101/codingfeng101.github.io/releases/download/demo/${file}`;

export const profile = {
  name: "冯国栋",
  nameEn: "Feng Guodong",
  seal: "国栋", // 页面右上角与落款处的朱红印章文字，建议 1–2 个字
  eyebrow: "AI 应用开发 · 全栈工程 · 知识图谱",
  headline: ["研究问题，", "也把", "答案", "做成产品"],
  headlineMark: "答案", // 这个词会被手绘圈圈住
  intro: "我关注知识图谱、AI Agent 与可编辑式创作。从研究问题出发，构建系统、打磨产品。",
  pageTitle: "冯国栋｜AI 应用开发与知识图谱",
  location: "江西 · 南昌",
  email: "3524962421@qq.com",
  phone: "15110582877",
  github: "https://github.com/CodingFeng101",
  wechatQr: assetUrl("assets/wechat-qr.jpg"),
};

// 首屏下方那段随滚动「被墨染开」的自述。marks 里的词会画上手绘下划线。
export const prose = {
  text: "我相信，好的研究会提出更好的问题，好的工程会落地更好的答案。所以我在知识图谱、AI Agent 与可编辑式创作之间来回往返——让复杂的知识，既能被检索与理解，也能被继续编辑与创造。",
  marks: ["知识图谱", "AI Agent", "可编辑式创作"],
};

// 章节：每章有一张「扉页」。poem 是竖排在扉页右侧的一句古诗，from 是出处。
export const chapters = {
  works: {
    index: "01", numeral: "第一章", title: "所作", en: "Selected Works",
    epigraph: "把一个想法，做成别人也能用的东西。",
    poem: "千淘万漉虽辛苦，吹尽狂沙始到金。", from: "刘禹锡《浪淘沙》",
  },
  research: {
    index: "02", numeral: "第二章", title: "所思", en: "Research & Patents",
    epigraph: "先把问题问对，答案才有地方安放。",
    poem: "路漫漫其修远兮，吾将上下而求索。", from: "屈原《离骚》",
  },
  experience: {
    index: "03", numeral: "第三章", title: "所历", en: "Experience",
    epigraph: "研究走出书页，落进真实的业务里。",
    poem: "纸上得来终觉浅，绝知此事要躬行。", from: "陆游《冬夜读书示子聿》",
  },
  education: {
    index: "04", numeral: "第四章", title: "所学", en: "Education & Honors",
    epigraph: "后来所有的能力，都从这里起笔。",
    poem: "问渠那得清如许，为有源头活水来。", from: "朱熹《观书有感》",
  },
  letter: { index: "05", numeral: "第五章", title: "来信", en: "Write to me", epigraph: "见字如面。" },
};

export const skills = [
  "Python",
  "TypeScript",
  "React",
  "Vite",
  "Node / Express",
  "FastAPI",
  "MySQL",
  "Neo4j",
  "Docker",
  "Git",
  "AI Agent",
  "MCP",
  "Prompt Engineering",
];

export const heroShots = {
  topLeft: { src: assetUrl("assets/unigraph-live.png"), label: "UniGraph", target: "unigraph" },
  topRight: { src: assetUrl("assets/hero-canvasanvil-interior.png"), label: "CanvasAnvil · 室内设计", target: "canvasanvil" },
  bottomLeft: { src: assetUrl("assets/hero-canvasanvil-diagram.jpg"), label: "CanvasAnvil · 图表绘制", target: "canvasanvil" },
  bottomRight: { src: assetUrl("assets/hero-slide-alchemy.jpg"), label: "Slide Alchemy · 可编辑", target: "slide-alchemy" },
};

// tone: 作品衬底色卡（peach / heather / cactus / oat）
// note: 截图旁的手写批注；motto: 盖在作品角上的闲章；video: 演示视频地址（留空则显示截图）
// caption: 有视频时的图注；stillCaption: 退回截图时的图注
export const projects = [
  {
    number: "01",
    id: "unigraph",
    title: "UniGraph",
    subtitle: "一站式知识图谱智造平台",
    githubRepo: "CodingFeng101/UniGraph",
    period: "2024.04 — 2025.05",
    role: "全栈参与",
    tone: "cactus",
    motto: "格物",
    video: releaseVideo("unigraph-demo.mp4"),
    note: "从一段文本，到一张能回答问题的图。",
    links: [
      { label: "开源", href: "https://github.com/CodingFeng101/UniGraph.git", kind: "source" },
      { label: "使用", href: "https://unigraph.jxselab.com", kind: "use" },
    ],
    copy: [
      "参与从原始文本到图谱索引、上下文构建与智能问答的完整流程。",
      "负责实体、关系、数据源与社区报告等离线索引构建，为在线检索提供结构化基础。",
      "实现实体属性向量化与相似度匹配，将问题中的关键实体映射到图谱节点。",
      "参与图谱问答接口与多维上下文重排融合，提升回答的相关性与可解释性。",
    ],
    stack: ["Neo4j", "FastAPI", "Python", "React", "TypeScript", "Docker"],
    image: assetUrl("assets/unigraph-live.png"),
    imageAlt: "UniGraph 平台登录页截图",
    caption: "UniGraph · 演示视频",
    stillCaption: "UniGraph · 线上版本",
    pipeline: ["文本输入", "实体关系抽取", "图谱索引", "上下文重排", "智能问答"],
  },
  {
    number: "02",
    id: "canvasanvil",
    title: "CanvasAnvil",
    subtitle: "多画布 AI 创作平台",
    githubRepo: "CodingFeng101/CanvasAnvil",
    period: "2026.01 — 2026.05",
    role: "独立开发",
    tone: "peach",
    motto: "随心",
    video: releaseVideo("canvasanvil-demo.mp4"),
    note: "圈一下，只改这里。",
    links: [
      { label: "开源", href: "https://github.com/CodingFeng101/CanvasAnvil.git", kind: "source" },
      { label: "使用", href: "https://canvasanvil.codingfgd.asia/", kind: "use" },
    ],
    copy: [
      "独立开发面向流程图、室内设计、PPT、海报与信息图的多画布 AI 创作平台。",
      "基于 React、TypeScript 与 Vite 构建多画布工作台，支持生成、局部修改、预览与导出。",
      "基于 Node / Express 封装统一 API 服务，覆盖模型配置、文件解析、PPT 生成与日志记录。",
      "设计统一模型调用层与多类 AI Skill，适配文本、参考图、遮罩图和多图输入。",
    ],
    stack: ["React", "TypeScript", "Vite", "Node / Express", "AI Agent", "多模态"],
    image: assetUrl("assets/canvasanvil-portal.png"),
    imageAlt: "CanvasAnvil 软件门户首页，展示多画布工作台及图表、室内设计和 PPT 入口",
    caption: "CanvasAnvil · 演示视频",
    stillCaption: "CanvasAnvil · 软件门户",
    pipeline: ["文本", "参考图", "多图输入", "AI Skill", "生成与编辑"],
  },
  {
    number: "03",
    id: "slide-alchemy",
    title: "Slide Alchemy",
    subtitle: "图片式 PPT 可编辑化重建 Skill",
    githubRepo: "CodingFeng101/slide-alchemy",
    period: "2026.06 — 至今",
    role: "项目负责人 / 开源作者",
    tone: "heather",
    motto: "点石",
    video: releaseVideo("slide-alchemy-demo.mp4"),
    note: "可编辑，才是真正的生产力。",
    links: [{ label: "开源", href: "https://github.com/CodingFeng101/slide-alchemy.git", kind: "source" }],
    copy: [
      "独立设计并开源图片型 PPT、PPTX 截图与扫描式演示文稿的可编辑化重建方案。",
      "建立背景重建、元素拆分、文本识别、图形复原、资产切片与 PPTX 组合流程。",
      "编写 Codex Skill 执行规范，封装页面分析、视觉还原、布局校验与结果修正步骤。",
      "将标题栏、卡片、图标、线条与表格复原为真实文本框、形状和独立图片资产。",
    ],
    stack: ["Python", "Codex Skill", "PPTX", "OCR", "图像处理"],
    before: assetUrl("assets/slide-alchemy-before.png"),
    after: assetUrl("assets/slide-alchemy-after.png"),
    caption: "Slide Alchemy · 演示视频",
    stillCaption: "拖动中线：左边是图片，右边已可编辑",
  },
];

export const papers = [
  {
    marker: "A",
    label: "TKDE · Major Revision（大修）· 第五作者",
    title: "Domain-Specific Semantic-Rich Knowledge Graph Construction through Human-LLM Team Working",
    summary: "探索 Human–LLM 协同的领域知识图谱设计流程，将自动探索与人工反馈结合，提升候选 Schema 的完整性与一致性。",
  },
  {
    marker: "B",
    label: "Knowledge-Based Systems · SCI 一区 · 投稿 / 在审 · 第四作者",
    title: "TriadKGC: Schema-Guided Knowledge Graph Completion with Multi-Level Validation",
    summary: "围绕 Schema 引导与多层验证展开知识图谱补全研究；当前仅展示投稿状态，不作录用或发表声明。",
  },
];

export const patents = [
  {
    marker: "C",
    title: "一种基于局部语义全局社区化的知识图谱搜索方法及系统",
    number: "ZL 2025 1 0134422.6",
    summary: "第二发明人。结合实体属性向量匹配、多级社区划分与多维上下文构建，提升知识图谱搜索的相关性与可解释性。",
  },
  {
    marker: "D",
    title: "一种室内装修图双模编辑与一致生成方法、设备及介质",
    number: "ZL 202610501360.2",
    summary: "第二发明人。面向 AI 室内设计的局部补丁 / 全局替换双模编辑，并保证图纸与物料清单同源一致。",
  },
  {
    marker: "E",
    title: "一种自适应层级医疗知识图谱社区构建方法、设备及介质",
    number: "ZL 2026 1 0669516.8",
    summary: "",
  },
];

export const experiences = [
  {
    id: "zhongcan",
    period: "2025.08 — 2025.09",
    company: "江西省众灿互动科技股份有限公司",
    role: "智能体开发实习生",
    details: [
      "参与垂直业务场景智能体系统开发，围绕业务话术、用户需求和任务流程完成功能设计。",
      "将业务话术知识库转化为知识图谱，并调优知识匹配、召回结果和回答支撑信息。",
      "参与选号、建联、需求转译智能体及多智能体协作框架的开发与优化。",
    ],
  },
  {
    id: "jiangxi-telecom",
    period: "2025.10 — 2026.06",
    company: "江西电信信息产业有限公司",
    role: "智能体开发实习生",
    details: [
      "负责智能教育资源推荐系统的知识图谱全链路模块设计与实现，支撑教学知识的组织、关联与检索。",
      "推进 RAG 检索链路的工程落地，支持课程推荐及学科知识问答。",
    ],
  },
];

// 教育经历：原站没有这一块，先放占位，换成你自己的学校即可
export const education = [
  {
    id: "edu-1",
    period: "2023.9-2027.6",
    school: "江西师范大学",
    major: "计算机科学与技术（师范）",
    note: "均分 82",
  },
];

export const honors = [
  "软件设计师（软考中级）资格证书",
  "综合素质二等奖学金",
  "“挑战杯”大学生创业计划大赛省级二等奖",
  "“建行杯”江西省大学生创新大赛省级二等奖",
];

export const letter = {
  greeting: "见字如面。",
  body: [
    "谢谢你读到这里。",
    "研究让我们提出更好的问题，工程让我们落地更好的答案。",
    "如果你也在做有意思的事，愿意聊聊，随时来信。",
  ],
};
