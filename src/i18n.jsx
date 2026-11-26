import { createContext, useContext } from "react";

// 语言：先看网址里的 ?lang=，再看访客上次手动选的，最后看浏览器语言。
// 浏览器语言里最先出现中文就用中文，最先出现英文就用英文；都没有时用英文。
export const LANGS = ["zh", "en"];
const STORAGE_KEY = "site-lang";

export function detectLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.includes(fromUrl)) return fromUrl;
  } catch {
    // 忽略
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // 隐私模式下可能读不到
  }
  const list = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
  for (const item of list) {
    const code = String(item).toLowerCase();
    if (code.startsWith("zh")) return "zh";
    if (code.startsWith("en")) return "en";
  }
  return "en";
}

export function saveLang(lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // 存不下也没关系，只是下次还按浏览器语言来
  }
}

export const HTML_LANG = { zh: "zh-CN", en: "en" };

// 界面上固定的文字（简历内容本身在 data/ 里）
export const UI = {
  zh: {
    switchTo: "EN",
    switchLabel: "Switch to English",
    home: "回到开头",
    mainNav: "主导航",
    chapters: "章节",
    toTop: "回到顶部",
    preface: "自述",
    foreword: "写在前面",
    browseWorks: "浏览代表作",
    writeLetter: "写一封信",
    scrollCue: "向下翻阅",
    stack: "技术栈",
    view: (label) => `查看 ${label}`,
    note: "研究 × 工程",
    stats: (title) => `${title} GitHub 统计`,
    linkLabel: (title, label) => `${title} ${label}链接`,
    videoLabel: (title) => `${title} 演示视频`,
    compareAfterAlt: "重建后的可编辑 PPTX 页面，文本框处于选中状态",
    compareBeforeAlt: "原始的图片式 PPT 页面",
    compareBefore: "图片 PPT",
    compareAfter: "可编辑 PPTX",
    compareLabel: "拖动对比原图与重建结果",
    papersCount: ["篇论文", "投稿与修改中"],
    patentsCount: ["项发明专利", "已获授权"],
    patentLabel: "已授权发明专利",
    patentNumber: (number) => `第二发明人 · 专利号 ${number}`,
    granted: "已授权",
    honors: "所获",
    email: "邮箱",
    phone: "电话",
    wechat: "微信",
    scanToAdd: "扫码添加",
    qr: "二维码",
    go: "前往",
    copy: "复制",
    copied: "已复制",
    copyFailed: "复制失败",
    wechatClose: "关闭微信二维码",
    wechatAlt: "微信好友二维码",
    wechatTitle: "微信扫码，添加好友",
    colophon: "纸短情长，不尽欲言。",
    end: "终",
  },
  en: {
    switchTo: "中",
    switchLabel: "切换到中文",
    home: "Back to the beginning",
    mainNav: "Main navigation",
    chapters: "Chapters",
    toTop: "Back to top",
    preface: "Preface",
    foreword: "A note first",
    browseWorks: "See selected works",
    writeLetter: "Write to me",
    scrollCue: "Scroll",
    stack: "Stack",
    view: (label) => `View ${label}`,
    note: "Think × Build",
    stats: (title) => `${title} GitHub stats`,
    linkLabel: (title, label) => `${title} ${label} link`,
    videoLabel: (title) => `${title} demo video`,
    compareAfterAlt: "Rebuilt editable PPTX slide with a text box selected",
    compareBeforeAlt: "Original image-based PPT slide",
    compareBefore: "Image PPT",
    compareAfter: "Editable PPTX",
    compareLabel: "Drag to compare the original and the rebuilt slide",
    papersCount: ["papers", "submitted / in revision"],
    patentsCount: ["invention patents", "granted"],
    patentLabel: "Granted invention patent",
    patentNumber: (number) => `2nd inventor · ${number}`,
    granted: "Granted",
    honors: "Honors",
    email: "Email",
    phone: "Phone",
    wechat: "WeChat",
    scanToAdd: "Scan to add",
    qr: "QR code",
    go: "Visit",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    wechatClose: "Close WeChat QR code",
    wechatAlt: "WeChat QR code",
    wechatTitle: "Scan with WeChat to add me",
    colophon: "The page is short; the rest is better said in person.",
    end: "Fin",
  },
};

export const LangContext = createContext({ lang: "zh", ui: UI.zh, setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

// 页码：中文用一二三，英文用阿拉伯数字
const DIGITS = "〇一二三四五六七八九";
export function chineseNumeral(n) {
  if (n <= 10) return n === 10 ? "十" : DIGITS[n];
  if (n < 20) return `十${DIGITS[n % 10] === "〇" ? "" : DIGITS[n % 10]}`;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${DIGITS[tens]}十${ones ? DIGITS[ones] : ""}`;
}

export function folioText(n, lang) {
  return lang === "en" ? String(n) : chineseNumeral(n);
}

// 把文字拆成逐个出场的小块：中文按字，英文按词（词后带一个不换行空格，免得空格被折叠）
export function isLatin(text) {
  return /[A-Za-z]/.test(text) && !/[㐀-鿿]/.test(text);
}

export function glyphs(text) {
  if (!isLatin(text)) return [...text];
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, index) => (index < words.length - 1 ? `${word} ` : word));
}
