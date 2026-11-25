import { useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "./motion.js";
import {
  chapters,
  education,
  experiences,
  heroShots,
  honors,
  letter,
  papers,
  patents,
  profile,
  projects,
  prose,
  skills,
} from "./data/resume.js";
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

const navItems = ["works", "research", "experience", "education", "letter"].map((id) => ({
  id,
  label: chapters[id].title,
  short: chapters[id].title,
}));
const rulerItems = [{ id: "top", short: "序" }, ...navItems];

export function App() {
  const [active, setActive] = useState("top");

  useLayoutEffect(() => {
    document.title = profile.pageTitle;
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
  }, []);

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
  const head = (chapter, sub) => `${profile.name} · ${chapter.title}${sub ? ` · ${sub}` : ""}`;

  return (
    <div className="site" style={{ "--corner": corner() }}>
      <InkDefs />
      <Preloader name={profile.name} nameEn={profile.nameEn} seal={profile.seal} />
      <Cursor />
      <div className="paper-grain" aria-hidden="true" />
      <Nav profile={profile} items={navItems} active={active} onNavigate={navigate} />
      <ScrollRuler items={rulerItems} active={active} onNavigate={navigate} />
      <ProgressBits onNavigate={navigate} />

      <main>
        <Hero profile={profile} shots={heroShots} skills={skills} onNavigate={navigate} folio={next()} style={PATTERNS.hero} />
        <Page className="band band--oat" folio={next()} head={`${profile.name} · 自述`} aria-label="自述" style={PATTERNS.prose}>
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
  );
}
