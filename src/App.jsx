import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "./motion.js";
import { getContent } from "./data/content.js";
import { HTML_LANG, LangContext, UI, detectLang, saveLang } from "./i18n.jsx";
import { Preloader } from "./components/Preloader.jsx";
import { Cursor } from "./components/Cursor.jsx";
import { Nav, ProgressBits, ScrollRuler } from "./components/Chrome.jsx";
import { InkDefs } from "./components/Ornaments.jsx";
import { cloudlets, coins, corner, crackle, lattice, meander, waves } from "./patterns.js";

// 每一章铺一种古典纹样作底：只在页边浮现，中间留白
const bg = (pattern) => ({ "--pattern": pattern });
const PATTERNS = {
  hero: bg(cloudlets()),
  prose: bg(crackle()),
  works: bg(meander()),
  research: bg(lattice()),
  experience: bg(waves("#faf9f5")),
  education: bg(coins()),
  letter: bg(cloudlets()),
};
import { Hero } from "./components/Hero.jsx";
import { ChapterTitle, Page, Prose } from "./components/Sections.jsx";
import { Project } from "./components/Project.jsx";
import { Research } from "./components/Research.jsx";
import { Education, Experience } from "./components/Story.jsx";
import { Letter } from "./components/Letter.jsx";

const NAV_IDS = ["works", "research", "experience", "education", "letter"];

// 切换语言前记下读到哪一页的哪个位置，换完再滚回去
function readingPosition() {
  const pages = [...document.querySelectorAll(".site .page")];
  const index = pages.findIndex((page) => page.getBoundingClientRect().bottom > window.innerHeight * 0.3);
  if (index < 0) return null;
  const rect = pages[index].getBoundingClientRect();
  return { index, ratio: rect.height ? -rect.top / rect.height : 0 };
}

export function App() {
  const [lang, setLangState] = useState(detectLang);
  const [active, setActive] = useState("top");
  const pending = useRef(null);
  const content = getContent(lang);
  const { chapters, education, experiences, heroShots, honors, letter, papers, patents, profile, projects, prose, skills } = content;
  const ui = UI[lang];

  const navItems = NAV_IDS.map((id) => ({
    id,
    label: chapters[id].name || chapters[id].title,
    short: chapters[id].short || chapters[id].title,
  }));
  const rulerItems = [{ id: "top", short: lang === "en" ? "Top" : "序" }, ...navItems];

  const langValue = useMemo(() => ({
    lang,
    ui,
    setLang: (next) => {
      if (next === lang) return;
      pending.current = readingPosition();
      saveLang(next);
      // 网址里带的 ?lang= 也一起改掉，免得刷新后又变回去
      const url = new URL(window.location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.delete("lang");
        window.history.replaceState(null, "", url);
      }
      setLangState(next);
    },
  }), [lang, ui]);

  // 语言写进 <html lang>、标题与描述
  useLayoutEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    document.title = profile.pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && profile.description) meta.setAttribute("content", profile.description);
  }, [lang, profile]);

  // 换语言后整页重新挂载：回到刚才读的位置，再让所有滚动动画重新量一次
  useLayoutEffect(() => {
    const position = pending.current;
    if (!position) return;
    pending.current = null;
    const page = document.querySelectorAll(".site .page")[position.index];
    if (page) {
      const top = page.getBoundingClientRect().top + window.scrollY + position.ratio * page.offsetHeight;
      window.scrollTo({ top, behavior: "instant" });
    }
    ScrollTrigger.refresh();
  }, [lang]);

  useLayoutEffect(() => {
    const triggers = [...document.querySelectorAll("[data-nav]")].map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(section.dataset.nav),
      }),
    );
    // 字体与图片加载完后重新计算触发位置
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, [lang]);

  const navigate = (selector) => (event) => {
    event?.preventDefault();
    const target = document.querySelector(selector);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  // 页码：从首屏开始，一页一页往下数
  let folio = 0;
  const next = () => ++folio;
  const head = (chapter, sub) => `${profile.name} · ${chapter.name || chapter.title}${sub ? ` · ${sub}` : ""}`;

  return (
    <LangContext.Provider value={langValue}>
    <Preloader name={profile.name} nameEn={lang === "en" ? getContent("zh").profile.name : profile.nameEn} seal={profile.seal} />
    <Cursor />
    <div className="site" key={lang} style={{ "--corner": corner() }}>
      <InkDefs />
      <div className="paper-grain" aria-hidden="true" />
      <Nav profile={profile} items={navItems} active={active} onNavigate={navigate} />
      <ScrollRuler items={rulerItems} active={active} onNavigate={navigate} />
      <ProgressBits onNavigate={navigate} />

      <main>
        <Hero profile={profile} shots={heroShots} skills={skills} onNavigate={navigate} folio={next()} style={PATTERNS.hero} />
        <Page className="band band--oat" folio={next()} head={`${profile.name} · ${ui.preface}`} aria-label={ui.preface} style={PATTERNS.prose}>
          <Prose prose={prose} />
        </Page>

        <div id="works" data-nav="works" style={PATTERNS.works}>
          <Page className="title-page" folio={next()}>
            <ChapterTitle chapter={chapters.works} seal={profile.seal} />
          </Page>
          {projects.map((project) => (
            <Page key={project.id} id={project.id} folio={next()} head={head(chapters.works, project.title)}>
              <Project project={project} />
            </Page>
          ))}
        </div>

        <div id="research" data-nav="research" style={PATTERNS.research}>
          <Page className="title-page band band--oat" folio={next()}>
            <ChapterTitle chapter={chapters.research} seal={profile.seal} />
          </Page>
          <Page className="band band--oat" folio={next()} head={head(chapters.research)}>
            <Research papers={papers} patents={patents} />
          </Page>
        </div>

        <div id="experience" data-nav="experience" style={PATTERNS.experience}>
          <Page className="title-page" folio={next()}>
            <ChapterTitle chapter={chapters.experience} seal={profile.seal} />
          </Page>
          <Page folio={next()} head={head(chapters.experience)}>
            <Experience experiences={experiences} />
          </Page>
        </div>

        <div id="education" data-nav="education" style={PATTERNS.education}>
          <Page className="title-page" folio={next()}>
            <ChapterTitle chapter={chapters.education} seal={profile.seal} />
          </Page>
          <Page folio={next()} head={head(chapters.education)}>
            <Education education={education} honors={honors} seal={profile.seal} />
          </Page>
        </div>
      </main>

      <Letter profile={profile} letter={letter} chapter={chapters.letter} folio={next()} style={PATTERNS.letter} />
    </div>
    </LangContext.Provider>
  );
}
