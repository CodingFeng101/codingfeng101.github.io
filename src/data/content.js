// 按语言拼出整份简历：中文是底稿，英文只覆盖需要翻译的字段。
import * as zh from "./resume.js";
import * as en from "./resume.en.js";

const byKey = (list, key, overrides) => list.map((item) => ({ ...item, ...(overrides[item[key]] || {}) }));

function englishProject(project) {
  const o = en.projectsEn[project.id] || {};
  const { links, stackMap = {}, ...rest } = o;
  return {
    ...project,
    ...rest,
    links: project.links.map((link) => ({ ...link, label: links?.[link.label] || link.label })),
    stack: project.stack.map((item) => stackMap[item] || item),
  };
}

function build(lang) {
  if (lang !== "en") return { ...zh };
  const chapters = Object.fromEntries(
    Object.entries(zh.chapters).map(([key, chapter]) => [key, { ...chapter, ...(en.chaptersEn[key] || {}) }]),
  );
  const heroShots = Object.fromEntries(
    Object.entries(zh.heroShots).map(([key, shot]) => [key, { ...shot, ...(en.heroShotsEn[key] || {}) }]),
  );
  return {
    ...zh,
    profile: { ...zh.profile, ...en.profileEn },
    prose: en.proseEn,
    chapters,
    heroShots,
    projects: zh.projects.map(englishProject),
    papers: byKey(zh.papers, "marker", en.papersEn),
    patents: byKey(zh.patents, "marker", en.patentsEn),
    experiences: byKey(zh.experiences, "id", en.experiencesEn),
    education: byKey(zh.education, "id", en.educationEn),
    honors: en.honorsEn,
    letter: en.letterEn,
  };
}

const cache = {};
export function getContent(lang) {
  if (!cache[lang]) cache[lang] = build(lang);
  return cache[lang];
}
