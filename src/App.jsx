import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  Article,
  Briefcase,
  ChatCircleDots,
  CheckCircle,
  DownloadSimple,
  EnvelopeSimple,
  FileText,
  GithubLogo,
  Graph,
  Images,
  MapPin,
  Phone,
  PresentationChart,
  Robot,
  SealCheck,
  Stack,
  WechatLogo,
  Wrench,
  X,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const skills = [
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

const projects = [
  {
    number: "01",
    id: "unigraph",
    title: "UniGraph",
    subtitle: "一站式知识图谱智造平台",
    period: "2024.04 — 2025.05",
    role: "全栈参与",
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
    imageAlt: "UniGraph GitHub 项目中的知识图谱构建界面截图",
    caption: "UniGraph 图谱构建工作区 · GitHub 项目截图",
    pipeline: [
      [FileText, "文本输入"],
      [Wrench, "实体关系抽取"],
      [Graph, "图谱索引"],
      [Stack, "上下文重排"],
      [ChatCircleDots, "智能问答"],
    ],
  },
  {
    number: "02",
    id: "canvasanvil",
    title: "CanvasAnvil",
    subtitle: "多画布 AI 创作平台",
    period: "2026.01 — 2026.05",
    role: "独立开发",
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
    image: assetUrl("assets/canvasanvil-live.png"),
    imageAlt: "CanvasAnvil GitHub 项目中的学术研究框架图生成示例",
    caption: "CanvasAnvil 图表生成示例 · GitHub 项目图",
    pipeline: [
      [FileText, "文本"],
      [Images, "参考图"],
      [Stack, "多图输入"],
      [Robot, "AI Skill"],
      [PresentationChart, "生成与编辑"],
    ],
  },
  {
    number: "03",
    id: "slide-alchemy",
    title: "Slide Alchemy",
    subtitle: "图片式 PPT 可编辑化重建 Skill",
    period: "2026.06 — 至今",
    role: "项目负责人 / 开源作者",
    links: [
      { label: "开源", href: "https://github.com/CodingFeng101/slide-alchemy.git", kind: "source" },
    ],
    copy: [
      "独立设计并开源图片型 PPT、PPTX 截图与扫描式演示文稿的可编辑化重建方案。",
      "建立背景重建、元素拆分、文本识别、图形复原、资产切片与 PPTX 组合流程。",
      "编写 Codex Skill 执行规范，封装页面分析、视觉还原、布局校验与结果修正步骤。",
      "将标题栏、卡片、图标、线条与表格复原为真实文本框、形状和独立图片资产。",
    ],
    stack: ["Python", "Codex Skill", "PPTX", "OCR", "图像处理"],
    before: assetUrl("assets/slide-alchemy-before.png"),
    after: assetUrl("assets/slide-alchemy-after.png"),
  },
];

const papers = [
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

const patents = [
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

const experiences = [
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

function useMagneticEffect(strength = 0.13) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const xTo = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
    const move = (event) => {
      const rect = element.getBoundingClientRect();
      xTo((event.clientX - rect.left - rect.width / 2) * strength);
      yTo((event.clientY - rect.top - rect.height / 2) * strength);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  return ref;
}

function MagneticLink({ children, className = "", ...props }) {
  const ref = useMagneticEffect();

  return (
    <a ref={ref} className={`magnetic-link ${className}`} {...props}>
      {children}
    </a>
  );
}

function MagneticButton({ children, className = "", ...props }) {
  const ref = useMagneticEffect();

  return (
    <button ref={ref} className={`magnetic-button ${className}`} {...props}>
      {children}
    </button>
  );
}

function MagneticArticle({ children, className = "", ...props }) {
  const ref = useMagneticEffect(0.035);

  return (
    <article ref={ref} className={`magnetic-surface ${className}`} {...props}>
      {children}
    </article>
  );
}

function MagneticInline({ children, className = "", ...props }) {
  const ref = useMagneticEffect();

  return (
    <span ref={ref} className={`magnetic-inline ${className}`} {...props}>
      {children}
    </span>
  );
}

function HeroDiagram() {
  return (
    <div className="hero-diagram">
      <img
        src={assetUrl("assets/hero-diagram-hd.png")}
        alt="问题驱动知识图谱，并连接 AI Agent 与可编辑创作的手绘关系图"
      />
    </div>
  );
}

function ProjectSection({ project }) {
  return (
    <section className="project-section section-anchor" id={project.id} data-section={project.id}>
      <div className="project-number" aria-hidden="true">{project.number}</div>
      <div className="project-copy reveal-group">
        <div className="project-title-row reveal-item">
          <div className="project-heading-main">
            <h2>{project.title}</h2>
            <span className="title-rule" />
            <p>{project.subtitle}</p>
          </div>
          <div className="project-heading-meta">
            <span className="role-tag">{project.role}</span>
            <span className="project-links" aria-label={`${project.title} 项目链接`}>
              {project.links.map((link) => {
                const Icon = link.kind === "source" ? GithubLogo : ArrowSquareOut;
                return (
                <MagneticLink
                  className="project-link"
                    href={link.href}
                    key={link.label}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} ${link.label}链接`}
                    title={`${project.title} · ${link.label}`}
                >
                  <Icon size={14} weight="bold" aria-hidden="true" />
                  <span>{link.label}</span>
                </MagneticLink>
                );
              })}
            </span>
          </div>
        </div>
        <p className="project-period reveal-item">{project.period}</p>
        <ul className="project-points">
          {project.copy.map((item) => (
            <li className="reveal-item" key={item}><CheckCircle size={16} weight="fill" />{item}</li>
          ))}
        </ul>
        <div className="tech-tags reveal-item">
          {project.stack.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <div className="project-visual reveal-group">
        {project.pipeline && (
          <div className="pipeline" aria-label={`${project.title} 处理流程`}>
            {project.pipeline.map(([Icon, label], index) => (
              <div className="pipeline-step reveal-item" key={label} style={{ "--step": index }}>
                <Icon size={25} weight="duotone" />
                <span>{label}</span>
                {index < project.pipeline.length - 1 && <ArrowRight className="pipeline-arrow" size={18} aria-hidden="true" />}
              </div>
            ))}
          </div>
        )}
        {project.image && (
          <figure className="paper-media reveal-item">
            <div className="media-mask"><img src={project.image} alt={project.imageAlt} /></div>
            <figcaption>{project.caption}</figcaption>
          </figure>
        )}
        {project.before && (
          <div className="alchemy-compare reveal-item">
            <figure className="alchemy-media-mask"><span>输入 · 图片 PPT</span><img src={project.before} alt="图片式 PPT 原始页面" /></figure>
            <ArrowRight size={30} weight="bold" aria-hidden="true" />
            <figure className="alchemy-media-mask"><span>输出 · 可编辑 PPTX</span><img src={project.after} alt="重建后可编辑文本框被选中" /></figure>
            <p className="alchemy-note ink-note">可编辑，才是真正的生产力。</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function App() {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const copyTimerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("projects");
  const [copiedContact, setCopiedContact] = useState("");
  const [wechatOpen, setWechatOpen] = useState(false);
  const [activeExperience, setActiveExperience] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let introFallback;
    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".intro-reveal, .reveal-item, .paper-card", { opacity: 1, y: 0, x: 0, clipPath: "inset(0 0 0 0)" });
        gsap.set(".timeline-item", { opacity: 1, y: 0, x: 0 });
        return;
      }

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".nav-shell", { y: -20, opacity: 0, duration: 0.6 })
        .from(".intro-reveal", { y: 26, opacity: 0, duration: 0.75, stagger: 0.1 }, "-=0.25")
        .from(".ink-note", { clipPath: "inset(0 100% 0 0)", duration: 0.75 }, "-=0.25");

      introFallback = window.setTimeout(() => {
        gsap.set(".intro-reveal, .ink-note", { clearProps: "opacity,transform,clipPath" });
      }, 2400);

      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.25 },
      });

      gsap.utils.toArray(".reveal-group").forEach((group) => {
        const items = group.querySelectorAll(".reveal-item");
        gsap.from(items, {
          y: 30,
          opacity: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      gsap.utils.toArray(".media-mask, .alchemy-media-mask").forEach((mask) => {
        gsap.from(mask, {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.05,
          ease: "power4.inOut",
          scrollTrigger: { trigger: mask, start: "top 80%", once: true },
        });
      });

      gsap.from(".paper-card", {
        y: 46,
        rotate: (index) => (index % 2 === 0 ? -1.2 : 1.2),
        opacity: 0,
        duration: 0.72,
        stagger: 0.11,
        ease: "back.out(1.2)",
        scrollTrigger: { trigger: ".research-grid", start: "top 80%", once: true },
      });

      gsap.from(".patent-stamp", {
        scale: 1.7,
        rotate: -18,
        opacity: 0,
        duration: 0.42,
        stagger: 0.18,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: ".research-grid", start: "center 75%", once: true },
      });

      gsap.from(".timeline-line-fill", {
        scaleX: 0,
        duration: 1.15,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".timeline", start: "top 82%", once: true },
      });

      gsap.from(".timeline-item", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.18,
        scrollTrigger: { trigger: ".timeline", start: "top 78%", once: true },
      });
    }, root);

    const sectionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.dataset.nav || "projects")),
      { rootMargin: "-35% 0px -55%", threshold: 0 },
    );
    root.querySelectorAll("[data-nav]").forEach((section) => sectionObserver.observe(section));

    return () => {
      window.clearTimeout(introFallback);
      window.clearTimeout(copyTimerRef.current);
      sectionObserver.disconnect();
      context.revert();
    };
  }, []);

  const scrollTo = (id) => (event) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyContact = async (value, key) => {
    const fallbackCopy = () => {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length);
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("Copy command failed");
    };

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          fallbackCopy();
        }
      } else {
        fallbackCopy();
      }
      setCopiedContact(key);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedContact(""), 1800);
    } catch {
      setCopiedContact(`${key}-error`);
    }
  };

  return (
    <div ref={rootRef} className="site-shell">
      <div className="page-grain" aria-hidden="true" />
      <aside className="scroll-rail" aria-hidden="true">
        <span>FIELD<br />NOTES<br />2026</span>
        <div className="scroll-track"><div ref={progressRef} className="scroll-fill" /></div>
        <small>SCROLL<br />PROGRESS</small>
      </aside>

      <header className="nav-shell">
        <a href="#top" className="brand" onClick={scrollTo("#top")} aria-label="回到首页"><i />冯国栋</a>
        <span className="brand-note">研究 × 工程 × AI 创造者</span>
        <nav aria-label="主导航">
          {[
            ["projects", "项目", "#projects"],
            ["research", "研究", "#research"],
            ["experience", "经历", "#experience"],
            ["contact", "联系", "#contact"],
          ].map(([id, label, href]) => (
            <a key={id} className={activeSection === id ? "active" : ""} href={href} onClick={scrollTo(href)}>{label}</a>
          ))}
        </nav>
      </header>

      <main>
        <section id="top" className="hero" data-nav="projects">
          <div className="hero-copy">
            <p className="eyebrow intro-reveal">AI 应用开发 · 全栈工程 · 知识图谱</p>
            <h1 className="intro-reveal">冯国栋</h1>
            <h2 className="intro-reveal">研究问题，也把<span>答案</span>做成产品</h2>
            <p className="hero-description intro-reveal">我关注知识图谱、AI Agent 与可编辑式创作。<br />从研究问题出发，构建系统、打磨产品，让复杂知识既能检索、理解，也能继续编辑与创造。</p>
            <div className="hero-actions intro-reveal">
              <MagneticLink href="#projects" onClick={scrollTo("#projects")} className="primary-action">浏览代表作 <ArrowRight size={18} /></MagneticLink>
              <MagneticLink href={assetUrl("feng-guodong-resume.pdf")} download className="secondary-action">下载 PDF <DownloadSimple size={18} /></MagneticLink>
            </div>
          </div>
          <div className="hero-visual intro-reveal">
            <HeroDiagram />
          </div>
          <div className="skill-strip intro-reveal"><strong>技术栈</strong>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </section>

        <div id="projects" data-nav="projects">
          {projects.map((project) => <ProjectSection key={project.id} project={project} />)}
        </div>

        <section id="research" className="research-section section-anchor" data-nav="research">
          <div className="section-index">04</div>
          <div className="section-heading reveal-group">
            <p className="reveal-item"><Article size={20} weight="duotone" />论文与专利</p>
            <h2 className="reveal-item">研究深度，工程落地</h2>
          </div>
          <div className="research-grid">
            {papers.map((paper) => (
              <MagneticArticle className="paper-card paper-card--paper" key={paper.marker}>
                <div className="paper-meta"><b>{paper.marker}</b><span>{paper.label}</span></div>
                <h3>{paper.title}</h3>
                <p>{paper.summary}</p>
              </MagneticArticle>
            ))}
            {patents.map((patent) => (
              <MagneticArticle className="paper-card patent-card" key={patent.marker}>
                <div className="paper-meta"><b>{patent.marker}</b><span>已授权发明专利</span></div>
                <h3>{patent.title}</h3>
                {patent.summary && <p>{patent.summary}</p>}
                {patent.number && <small>第二发明人 · 专利号：{patent.number}</small>}
                <div className="patent-stamp"><SealCheck size={23} weight="bold" />已授权</div>
              </MagneticArticle>
            ))}
          </div>
        </section>

        <section id="experience" className="experience-section section-anchor" data-nav="experience">
          <div className="section-index">05</div>
          <div className="section-heading reveal-group">
            <p className="reveal-item"><Briefcase size={20} weight="duotone" />实践经历</p>
            <h2 className="reveal-item">把研究放进真实业务</h2>
          </div>
          <div className="timeline">
            <div className="timeline-line"><span className="timeline-line-fill" /></div>
            {experiences.map((experience) => (
              <article
                className={`timeline-item${activeExperience === experience.id ? " is-active" : ""}`}
                key={experience.id}
                tabIndex={0}
                aria-expanded={activeExperience === experience.id}
                aria-controls={`${experience.id}-details`}
                onMouseEnter={() => setActiveExperience(experience.id)}
                onMouseLeave={() => setActiveExperience(null)}
                onFocus={() => setActiveExperience(experience.id)}
                onBlur={() => setActiveExperience(null)}
                onKeyDown={(event) => event.key === "Escape" && event.currentTarget.blur()}
              >
                <i aria-hidden="true" />
                <time>{experience.period}</time>
                <h3>{experience.company}</h3>
                <p>{experience.role}</p>
                <div className="experience-popover" id={`${experience.id}-details`}>
                  <strong>工作内容</strong>
                  <ul>
                    {experience.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="honors-section section-anchor" data-nav="experience">
          <div className="section-index">06</div>
          <div className="section-heading compact reveal-group"><p className="reveal-item"><SealCheck size={20} weight="duotone" />荣誉证书</p></div>
          <p className="honors-copy reveal-item">软件设计师（软考中级）资格证书 · 综合素质二等奖学金 · “挑战杯”大学生创业计划大赛省级二等奖 · “建行杯”江西省大学生创新大赛省级二等奖</p>
        </section>
      </main>

      <footer id="contact" className="contact-footer" data-nav="contact">
        <div>
          <p className="footer-thesis">研究让我们提出更好的问题，工程让我们落地更好的答案。</p>
        </div>
        <div className="contact-links">
          <MagneticButton type="button" onClick={() => copyContact("3524962421@qq.com", "email")}>
            <EnvelopeSimple size={19} />
            {copiedContact === "email" ? "邮箱已复制" : copiedContact === "email-error" ? "复制失败" : "复制邮箱"}
          </MagneticButton>
          <MagneticButton type="button" onClick={() => copyContact("15110582877", "phone")}>
            <Phone size={19} />
            {copiedContact === "phone" ? "电话已复制" : copiedContact === "phone-error" ? "复制失败" : "复制电话"}
          </MagneticButton>
          <MagneticButton type="button" onClick={() => setWechatOpen(true)} aria-haspopup="dialog">
            <WechatLogo size={19} />微信
          </MagneticButton>
          <MagneticLink href="https://github.com/CodingFeng101" target="_blank" rel="noreferrer"><GithubLogo size={19} />GitHub <ArrowUpRight size={14} /></MagneticLink>
          <MagneticInline><MapPin size={19} />江西 · 南昌</MagneticInline>
        </div>
      </footer>

      {wechatOpen && (
        <div className="wechat-backdrop" role="presentation" onClick={() => setWechatOpen(false)}>
          <div className="wechat-dialog" role="dialog" aria-modal="true" aria-labelledby="wechat-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="wechat-close" onClick={() => setWechatOpen(false)} aria-label="关闭微信二维码">
              <X size={18} weight="bold" />
            </button>
            <img src={assetUrl("assets/wechat-qr.jpg")} alt="微信好友二维码" />
            <p id="wechat-title">微信扫码添加</p>
          </div>
        </div>
      )}
    </div>
  );
}
