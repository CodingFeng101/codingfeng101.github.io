// 古典纹样：都画成可平铺的小 SVG，作为整页背景用（只在页面四周显出来，中间留白给内容）。
// 颜色都是极淡的墨色；青海波需要用底色把下层鳞片盖住，所以要传入底色。
const svg = (w, h, body) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`)}")`;
const INK = "rgba(20,20,19,.11)";
const CLAY = "rgba(198,97,63,.16)";

// 青海波：一层层鱼鳞般的水波
export const waves = (bg = "#faf9f5") => {
  const scale = (x, y) =>
    `<circle cx='${x}' cy='${y}' r='19.5' fill='${bg}' stroke='${INK}'/>` +
    [14.5, 9.5, 4.5].map((r) => `<circle cx='${x}' cy='${y}' r='${r}' fill='none' stroke='${INK}'/>`).join("");
  return svg(40, 20, scale(0, 0) + scale(40, 0) + scale(20, 10) + scale(0, 20) + scale(40, 20));
};

// 回纹：连续的方折回旋，取「回环往复、绵延不断」
export const meander = () =>
  svg(28, 28, `<path d='M0 26H26V2H6V20H20V8H12V14' fill='none' stroke='${INK}' stroke-width='1.1'/>`);

// 古钱纹：圆环相扣
export const coins = () =>
  svg(32, 32, `<g fill='none' stroke='${INK}'><circle cx='0' cy='16' r='16'/><circle cx='32' cy='16' r='16'/><circle cx='16' cy='0' r='16'/><circle cx='16' cy='32' r='16'/></g>`);

// 冰裂纹：瓷器开片一样的不规则裂线
export const crackle = () =>
  svg(180, 180, `<path fill='none' stroke='${INK}' d='M0 40L38 52 70 18 112 30 140 0M38 52L30 98 0 110M30 98L76 120 70 18M76 120L118 92 112 30M118 92L180 104M118 92L132 150 180 160M76 120L60 180M132 150L96 180M30 98L14 150 0 154M140 0L180 22M112 30L162 56 180 50M162 56L150 92M14 150L60 180'/>`);

// 窗棂：冰梅格子窗的直棂与方胜
export const lattice = () =>
  svg(48, 48, `<g fill='none' stroke='${INK}'><path d='M0 24H48M24 0V48'/><rect x='14' y='14' width='20' height='20' transform='rotate(45 24 24)'/><rect x='19' y='19' width='10' height='10'/></g>`);

// 祥云纹（小）：信笺一页的底纹
export const cloudlets = () =>
  svg(120, 80, `<g fill='none' stroke='${CLAY}' stroke-linecap='round'><path d='M14 40c-6 0-8-8-2-10 4-1 7 2 6 5M18 35c-2-9 8-14 14-9 3-7 14-7 16 1 8-1 12 8 6 12H10'/><path d='M74 76c-6 0-8-8-2-10 4-1 7 2 6 5M78 71c-2-9 8-14 14-9 3-7 14-7 16 1 8-1 12 8 6 12H70'/></g>`);

// 回纹角花：版框四角用
export const corner = () =>
  svg(56, 56, `<path d='M2 56V2H56M8 56V8H56M14 34V14H34V26H22V20H28' fill='none' stroke='rgba(20,20,19,.28)' stroke-width='1.2'/>`);
