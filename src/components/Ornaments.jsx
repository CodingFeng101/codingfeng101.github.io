import { useId, useMemo } from "react";
// 手绘装饰：全部是自己画的 SVG 线条，用 DrawSVG 描线动画画出来。
// 每条需要描线的 path 都带 class="draw"，由动效层统一处理。

export function HandCircle({ className = "" }) {
  return (
    <svg className={`hand-circle ${className}`} viewBox="0 0 220 90" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="draw"
        d="M30 22C62 6 150 2 192 20c26 11 24 40-8 54-38 17-118 16-156-2C-2 58 6 30 44 16c22-8 54-11 82-9"
      />
    </svg>
  );
}

export function HandUnderline({ className = "", variant = 0 }) {
  const paths = [
    "M3 9C40 4 78 12 118 7s58-3 79 1",
    "M3 7c30 5 62-4 96 0s70 6 98-2",
    "M4 10C36 3 70 9 104 6c36-3 64 4 92-2",
  ];
  return (
    <svg className={`hand-underline ${className}`} viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
      <path className="draw" d={paths[variant % paths.length]} />
    </svg>
  );
}

export function HandArrow({ className = "" }) {
  return (
    <svg className={`hand-arrow ${className}`} viewBox="0 0 120 80" aria-hidden="true">
      <path className="draw" d="M6 10c28-6 58 2 74 22 10 12 14 26 14 38" />
      <path className="draw" d="M80 58l14 14 12-18" />
    </svg>
  );
}

// 色卡上的手绘曲线纹理（自己画的几种笔势）
const squiggles = [
  "M10 70C40 20 70 110 100 60s60-50 90 0",
  "M14 40c30 40 60-30 90 10s50 50 80-6",
  "M20 90C40 30 90 30 100 70s50 40 70-30",
  "M12 50c20-30 50-30 60 0s40 40 60 0 40-30 58 4",
];

export function Squiggle({ variant = 0, className = "" }) {
  return (
    <svg className={`squiggle ${className}`} viewBox="0 0 200 130" aria-hidden="true">
      <path className="draw-loop" d={squiggles[variant % squiggles.length]} />
    </svg>
  );
}

// 一枚小星花：六笔长短不一的墨线，用作分隔与点缀
export function Asterisk({ className = "" }) {
  return (
    <svg className={`asterisk ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 4v32M6 12l28 16M6 28l28-16" />
    </svg>
  );
}

// 朱红印章
export function Seal({ text, className = "", size = "md" }) {
  const chars = [...text];
  return (
    <span className={`seal seal--${size} ${chars.length > 1 ? "seal--multi" : ""} ${className}`} aria-hidden="true">
      {chars.map((char, index) => <i key={index}>{char}</i>)}
    </span>
  );
}

// 全局 SVG 滤镜：让所有手绘线条带上毛笔的毛边和墨晕
export function InkDefs() {
  return (
    <svg className="ink-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
        <filter id="ink-brush" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="3" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.35" />
        </filter>
      </defs>
    </svg>
  );
}

// 一笔画成的圆相：起笔重按、越走越细，收笔处笔毛散开成飞白，起笔旁溅几点墨。
// 形状由中线 + 逐点笔宽算出来，再用一条沿中线描出的蒙版把它「写」出来。
function rng(seed) {
  let x = seed * 9301 + 49297;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}
const C = 200;
const R = 148;
const at = (t, off, seed) => {
  const a = ((-88 - t * 322) * Math.PI) / 180;
  const r = R + 5 * Math.sin(t * Math.PI * 3 + seed) - 7 * t + off;
  return [C + Math.cos(a) * r, C + Math.sin(a) * r];
};
const width = (t, seed) => {
  if (t < 0.05) return 20 + (t / 0.05) * 22; // 起笔：一按
  return Math.max(1.6, 42 * Math.pow(1 - t, 0.7) * (1 + 0.07 * Math.sin(t * 11 + seed)));
};
const ribbon = (t0, t1, side, seed, n = 90) => {
  const left = [];
  const right = [];
  for (let i = 0; i <= n; i += 1) {
    const t = t0 + ((t1 - t0) * i) / n;
    const [o, w] = side(t);
    left.push(at(t, o + w / 2, seed));
    right.push(at(t, o - w / 2, seed));
  }
  const pts = [...left, ...right.reverse()];
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
};
function buildEnso(seed) {
  const rand = rng(seed + 1);
  const body = ribbon(0, 0.62, (t) => [0, width(t, seed)], seed, 120);
  const bristles = Array.from({ length: 8 }, (_, i) => {
    const o = -0.46 + (0.92 * i) / 7 + (rand() - 0.5) * 0.06;
    const end = 0.76 + rand() * 0.24;
    return ribbon(0.56, end, (t) => {
      const w = width(t, seed);
      const k = (t - 0.56) / (end - 0.56);
      return [o * w * (1 + k * 0.35), (w / 8) * 1.6 * (1 - k * k)];
    }, seed, 50);
  });
  const [sx, sy] = at(0, 0, seed);
  const dots = Array.from({ length: 5 }, (_, i) => {
    const ang = (-150 + rand() * 120) * (Math.PI / 180);
    const dist = 30 + rand() * 34 + i * 4;
    return [sx + Math.cos(ang) * dist, sy + Math.sin(ang) * dist - 6, 1.4 + rand() * 3.6];
  });
  const spine = Array.from({ length: 81 }, (_, i) => at(i / 80, 0, seed));
  return {
    body,
    bristles,
    dots,
    blot: [sx, sy],
    spine: `M${spine.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}`,
  };
}

export function Enso({ className = "", seed = 1 }) {
  const id = useId().replace(/:/g, "");
  const shape = useMemo(() => buildEnso(seed), [seed]);
  return (
    <svg className={`enso ${className}`} viewBox="0 0 400 400" aria-hidden="true">
      <mask id={`enso-${id}`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="500">
        <path className="draw enso-reveal" d={shape.spine} />
      </mask>
      <g className="enso-ink" mask={`url(#enso-${id})`}>
        <ellipse cx={shape.blot[0]} cy={shape.blot[1]} rx="17" ry="14" transform={`rotate(-20 ${shape.blot[0]} ${shape.blot[1]})`} />
        <path d={shape.body} />
        {shape.bristles.map((d, i) => <path key={i} className="enso-bristle" d={d} />)}
      </g>
      {shape.dots.map(([x, y, r], i) => <circle key={i} className="enso-dot" cx={x} cy={y} r={r} />)}
    </svg>
  );
}

// 每一章扉页的小画：竹、兰、舟、梅，都是几笔墨线
export function Bamboo({ className = "" }) {
  const leaf = (x, y, rot, s = 1) => (
    <path key={`${x}${y}`} className="motif-leaf" transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} d="M0 0C18-8 44-8 64-2 44 4 20 6 0 0Z" />
  );
  return (
    <svg className={`motif motif--bamboo ${className}`} viewBox="0 0 200 340" aria-hidden="true">
      {[[96, 340, 264], [97, 258, 182], [99, 176, 102], [101, 96, 28]].map(([x, y1, y2], i) => (
        <path key={i} className="draw motif-stalk" d={`M${x} ${y1}L${x + 1} ${y2}`} />
      ))}
      {[260, 178, 98].map((y) => <path key={y} className="draw motif-node" d={`M${88} ${y + 2}Q${98} ${y - 4} ${110} ${y + 1}`} />)}
      <path className="draw motif-twig" d="M100 178C120 160 140 150 160 146" />
      <path className="draw motif-twig" d="M100 98C82 82 66 74 46 70" />
      {leaf(150, 146, -12)}{leaf(156, 150, 18, 0.9)}{leaf(152, 148, 44, 0.8)}
      {leaf(48, 70, 196)}{leaf(52, 72, 160, 0.85)}{leaf(50, 70, 225, 0.75)}
      {leaf(101, 30, -60, 0.7)}{leaf(101, 32, 250, 0.65)}
    </svg>
  );
}

export function Orchid({ className = "" }) {
  return (
    <svg className={`motif motif--orchid ${className}`} viewBox="0 0 260 220" aria-hidden="true">
      <path className="motif-leaf" d="M124 218C112 150 70 80 6 52 72 78 116 146 130 218Z" />
      <path className="motif-leaf" d="M130 218C138 140 176 84 252 70 184 92 146 146 138 218Z" />
      <path className="motif-leaf" d="M126 218C120 168 104 128 74 104 110 124 128 166 132 218Z" />
      <path className="motif-leaf" d="M134 218C146 178 170 150 206 140 174 158 154 186 140 218Z" />
      <path className="draw motif-twig" d="M132 218C134 170 146 130 160 104" />
      <g className="motif-bloom" transform="translate(160 100)">
        <path d="M0 0C-10-14-8-28 2-34 4-20 6-10 0 0Z" /><path d="M0 0C12-8 26-6 32 4 18 4 8 4 0 0Z" />
        <path d="M0 0C-14-2-24 6-26 16-14 12-6 8 0 0Z" /><circle className="motif-heart" r="2.4" />
      </g>
    </svg>
  );
}

export function Boat({ className = "" }) {
  return (
    <svg className={`motif motif--boat ${className}`} viewBox="0 0 260 110" aria-hidden="true">
      <path className="motif-leaf" d="M50 70Q130 92 214 66Q132 78 50 70Z" />
      <path className="draw motif-twig" d="M140 72L136 34" />
      <path className="draw motif-twig" d="M124 40Q136 26 150 38" />
      <path className="draw motif-twig" d="M118 68L104 52" />
      {["M8 86Q40 80 72 86T136 86", "M120 96Q150 91 180 96T240 96", "M30 102Q60 98 90 102"].map((d) => (
        <path key={d} className="draw motif-water" d={d} />
      ))}
    </svg>
  );
}

// 一团慢慢晕开的淡墨
export function InkWash({ className = "", tone = "ink" }) {
  return (
    <span className={`ink-wash ink-wash--${tone} ${className}`} aria-hidden="true" />
  );
}

const DIGITS = "〇一二三四五六七八九";
export function toChineseNumeral(n) {
  if (n <= 10) return n === 10 ? "十" : DIGITS[n];
  if (n < 20) return `十${DIGITS[n % 10] === "〇" ? "" : DIGITS[n % 10]}`;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${DIGITS[tens]}十${ones ? DIGITS[ones] : ""}`;
}

// 中文逐字；英文逐词，空格原样保留在词与词之间
function splitInk(text) {
  return /[㐀-鿿]/.test(text) ? [...text] : text.split(/(\s+)/).filter(Boolean);
}

// 把一段文字按词拆开，指定的词包上手绘下划线
export function MarkedText({ text, marks = [], wordClass = "ink-word" }) {
  const pattern = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = marks.length ? text.split(pattern) : [text];
  let markIndex = 0;
  return parts.flatMap((part, partIndex) => {
    if (!part) return [];
    if (marks.includes(part)) {
      const variant = markIndex++;
      return [
        <span className="marked" key={`m${partIndex}`}>
          {splitInk(part).map((piece, i) => (/^\s+$/.test(piece) ? piece : <span className={wordClass} key={i}>{piece}</span>))}
          <HandUnderline variant={variant} />
        </span>,
      ];
    }
    return splitInk(part).map((piece, i) => (/^\s+$/.test(piece) ? piece : <span className={wordClass} key={`${partIndex}-${i}`}>{piece}</span>));
  });
}

// 远山：三层淡墨山影，越远越淡，滚动时各走各的速度
export function Mountains({ className = "" }) {
  const layers = [
    ["far", "M0 210C120 170 200 120 300 150S470 90 560 130 760 60 880 120 1080 100 1180 140 1360 110 1440 150V300H0Z"],
    ["mid", "M0 240C90 200 180 190 260 215S420 150 520 200 700 170 820 210 1000 140 1120 195 1320 180 1440 220V300H0Z"],
    ["near", "M0 272C140 244 240 256 360 263S600 228 760 258 1040 238 1200 262 1380 250 1440 258V300H0Z"],
  ];
  return (
    <div className={`mountains ${className}`} aria-hidden="true">
      {layers.map(([name, d]) => (
        <svg key={name} className={`mtn mtn--${name}`} viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path d={d} />
        </svg>
      ))}
    </div>
  );
}

// 一枝梅：枝干用描线画出，花一朵朵开
const PLUM_FLOWERS = [[190, 150, 1], [182, 36, .85], [278, 92, .9], [72, 124, .8], [214, 68, 1.1], [140, 126, .9], [300, 18, .75], [250, 44, .95]];
const PLUM_BUDS = [[160, 156], [176, 56], [268, 78], [98, 140], [232, 60]];
// flip：左右镜像（画在 SVG 内部，避免和动画的 transform 冲突）
export function PlumBranch({ className = "", flip = false }) {
  return (
    <svg className={`plum ${className}`} viewBox="0 0 320 260" aria-hidden="true">
      <g transform={flip ? "translate(320 0) scale(-1 1)" : undefined}>
      <path className="draw plum-trunk" d="M8 252C40 202 70 182 110 150S180 100 210 70 260 30 300 18" />
      <path className="draw plum-twig" d="M110 150C130 160 160 162 190 150" />
      <path className="draw plum-twig" d="M178 96C170 72 172 54 182 36" />
      <path className="draw plum-twig" d="M240 50C255 60 270 75 278 92" />
      <path className="draw plum-twig" d="M72 180C60 160 62 140 72 124" />
      {PLUM_BUDS.map(([x, y], i) => <circle key={`b${i}`} className="plum-bud" cx={x} cy={y} r="3" />)}
      {PLUM_FLOWERS.map(([x, y, s], i) => (
        <g key={i} className="plum-flower" transform={`translate(${x} ${y}) scale(${s})`}>
          <g className="plum-bloom">
            {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5} cy={Math.sin((a * Math.PI) / 180) * 5} r="4.6" />)}
            <circle className="plum-heart" r="1.8" />
          </g>
        </g>
      ))}
      </g>
    </svg>
  );
}

// 几只远飞的鸟，一笔一只
export function Birds({ count = 3, className = "" }) {
  return (
    <div className={`birds ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="bird" viewBox="0 0 28 10" style={{ top: `${[18, 34, 8, 46][i % 4]}%`, width: `${[18, 13, 11, 15][i % 4]}px` }}>
          <path d="M1 8Q7 1 14 7Q21 1 27 8" />
        </svg>
      ))}
    </div>
  );
}

// 落下的梅瓣
export function Petals({ count = 6 }) {
  return (
    <div className="petals" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => <i key={i} className="petal" style={{ left: `${8 + ((i * 37) % 84)}%` }} />)}
    </div>
  );
}

// 版框：四个角的细线，像古书每页的边栏
export function PageFrame() {
  return <span className="page-frame" aria-hidden="true"><i /><i /><i /><i /></span>;
}

// 祥云：一朵如意云头，三处回卷
export function Cloud({ className = "", flip = false }) {
  return (
    <svg className={`cloud ${className}`} viewBox="0 0 200 90" aria-hidden="true">
      <g transform={flip ? "translate(200 0) scale(-1 1)" : undefined}>
      <path className="draw" d="M30 58C26 40 42 28 58 34 62 20 84 16 94 30 104 18 128 22 128 40 144 38 152 54 142 64 136 72 122 70 122 62 122 56 130 54 133 58" />
      <path className="draw" d="M58 34C70 36 72 50 62 52 55 53 54 45 60 44" />
      <path className="draw" d="M94 30C102 40 96 52 86 50 80 48 82 40 88 41" />
      <path className="draw" d="M30 58C30 66 20 68 16 63 12 57 18 52 23 55" />
      <path className="draw" d="M14 72H150C170 72 180 62 194 68" />
      </g>
    </svg>
  );
}
