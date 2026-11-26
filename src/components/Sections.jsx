import { useRef } from "react";
import { gsap, useMotion, EASE, playWhileVisible, animatePlum, ambientLoops, petalLoops, birdLoops } from "../motion.js";
import { Asterisk, Bamboo, Birds, Boat, Cloud, Petals, Enso, Mountains, Orchid, InkWash, MarkedText, PageFrame, PlumBranch, Seal } from "./Ornaments.jsx";
import { folioText, glyphs, useLang } from "../i18n.jsx";

// 一「页」：占满一屏，像书一样带书眉和页码
export function Page({ folio, head, className = "", children, ...rest }) {
  const { lang } = useLang();
  return (
    <section className={`page ${className}`} {...rest}>
      <PageFrame />
      {head && <span className="running-head" aria-hidden="true">{head}</span>}
      {children}
      {folio && <span className="folio" aria-hidden="true">— {folioText(folio, lang)} —</span>}
    </section>
  );
}

// 一段随滚动「被墨染开」的自述：字从浅灰慢慢变成墨色，关键词下的手绘线跟着画出来
export function Prose({ prose }) {
  const ref = useRef(null);
  const { ui } = useLang();

  useMotion(ref, ({ motion }) => {
    if (!motion) return undefined;
    const q = gsap.utils.selector(ref.current);
    const chars = q(".prose-text .ink-word");
    const step = 0.05;
    gsap.set(chars, { opacity: 0.14 });
    gsap.set(q(".prose-text .draw"), { drawSVG: "0%" });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: q(".prose-text")[0], start: "top 80%", end: "bottom 45%", scrub: 0.8 },
    });
    tl.to(chars, { opacity: 1, duration: 0.4, stagger: step, ease: "none" }, 0);
    q(".prose-text .marked").forEach((mark) => {
      const first = chars.indexOf(mark.querySelector(".ink-word"));
      const length = mark.querySelectorAll(".ink-word").length;
      tl.to(mark.querySelector(".draw"), { drawSVG: "100%", duration: length * step + 0.3, ease: "none" }, first * step + 0.2);
    });

    gsap.from(q(".prose-quote"), {
      scale: 0.6, rotate: -12, opacity: 0, duration: 1, ease: "back.out(1.8)",
      scrollTrigger: { trigger: ref.current, start: "top 75%" },
    });
    gsap.to(q(".prose-quote"), {
      yPercent: -60, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.fromTo(q(".prose .ink-wash"), { scale: 0.4, opacity: 0 }, {
      scale: 1.15, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 40%", scrub: 1 },
    });
    gsap.from(q(".prose-sign"), {
      opacity: 0, x: -20, duration: 0.8, ease: EASE.soft,
      scrollTrigger: { trigger: q(".prose-sign")[0], start: "top 92%" },
    });
    animatePlum(ref.current, ref.current);
    playWhileVisible(ref.current, [...ambientLoops(ref.current), ...petalLoops(ref.current), gsap.to(q(".prose-sign .asterisk"), { rotate: 360, duration: 14, ease: "none", repeat: -1 })]);
    return undefined;
  });

  return (
    <div ref={ref} className="prose">
      <InkWash tone="clay" />
      <PlumBranch className="prose-plum" flip />
      <Petals count={5} />
      <span className="prose-quote" aria-hidden="true">“</span>
      <p className="prose-text"><MarkedText text={prose.text} marks={prose.marks} /></p>
      <p className="prose-sign"><Asterisk /> {ui.foreword}</p>
    </div>
  );
}

// 每章扉页角落的一幅小画
const MOTIFS = { "01": Bamboo, "02": Orchid, "03": Boat, "04": PlumBranch };

// 扉页：圆相里写章名，右边竖排一句古诗，落一枚小印
export function ChapterTitle({ chapter, seal }) {
  const ref = useRef(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) return undefined;
    const q = gsap.utils.selector(ref.current);
    gsap.set(q(".enso .draw, .motif .draw"), { drawSVG: "0%" });

    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: ref.current, start: "top 62%" } })
      .fromTo(q(".ink-wash"), { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" })
      .from(q(".enso-dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.35, stagger: 0.05, ease: "back.out(3)" }, 0.05)
      .to(q(".enso-reveal"), { drawSVG: "100%", duration: 1.8, ease: "power1.inOut" }, 0.15)
      .from(q(".tp-mountains .mtn"), { yPercent: 50, opacity: 0, duration: 2, stagger: 0.15 }, 0.2)
      .to(q(".motif .draw"), { drawSVG: "100%", duration: 1, stagger: 0.08, ease: "power2.out" }, 0.6)
      .from(q(".motif-leaf, .motif-bloom, .plum-bud, .plum-bloom"), { opacity: 0, y: 6, duration: 0.6, stagger: 0.06 }, 1)
      .from(q(".tp-title i"), { yPercent: 115, duration: 1.2, stagger: 0.16, ease: EASE.expo }, 0.45)
      .from(q(".tp-numeral"), { opacity: 0, y: -10, duration: 0.7 }, 0.6)
      .from(q(".tp-en"), { opacity: 0, letterSpacing: "0.8em", duration: 1.1 }, 0.8)
      .from(q(".tp-epigraph i"), { opacity: 0, duration: 0.5, stagger: 0.05 }, 1)
      .from(q(".tp-poem-line i"), { opacity: 0, y: -8, duration: 0.5, stagger: 0.07 }, 0.9)
      .from(q(".tp-from"), { opacity: 0, duration: 0.6 }, "-=0.2")
      .from(q(".tp-seal"), { scale: 2.6, rotate: 30, opacity: 0, duration: 0.5, ease: "back.out(2.6)" }, "-=0.2");

    // 滚动时：圆相慢慢转，淡墨往上漂
    gsap.to(q(".enso"), {
      rotate: 40, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    gsap.to(q(".ink-wash"), {
      yPercent: -25, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    // 两朵祥云：描出后随滚动向两边慢慢散开
    gsap.set(q(".cloud .draw"), { drawSVG: "0%" });
    gsap.to(q(".cloud .draw"), { drawSVG: "100%", duration: 1.8, stagger: 0.06, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 60%" } });
    q(".cloud").forEach((cloud, i) => {
      gsap.fromTo(cloud, { x: i ? 40 : -40 }, {
        x: i ? -60 : 60, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });
    // 一直在动的：落梅、飞鸟、竹兰摇、舟起伏、云漂
    playWhileVisible(ref.current, [...ambientLoops(ref.current), ...petalLoops(ref.current), ...birdLoops(ref.current)]);
    if (window.matchMedia("(min-width: 1101px)").matches) {
      gsap.to(q(".tp-poem"), {
        y: -50, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }
    return undefined;
  });

  const Motif = MOTIFS[chapter.index];
  const [first, second] = chapter.poem ? chapter.poem.split(/(?<=，)/) : [];

  return (
    <div ref={ref} className="tp">
      <InkWash />
      <Mountains className="tp-mountains" />
      {Motif && <Motif className="tp-motif motif" />}
      <Petals count={8} />
      <Birds count={2} className="tp-birds" />
      <Cloud className="cloud--tl" />
      <Cloud className="cloud--br" flip />
      <p className="tp-numeral">{chapter.numeral} · {chapter.index}</p>
      <div className="tp-center">
        <Enso seed={Number(chapter.index) || 1} />
        <h2 className="tp-title" lang="zh-CN" aria-label={chapter.name || chapter.title}>{[...chapter.title].map((char, index) => <span key={index}><i>{char}</i></span>)}</h2>
      </div>
      <p className="tp-en">{chapter.en}</p>
      <p className="tp-epigraph">{glyphs(chapter.epigraph).map((char, index) => <i key={index}>{char}</i>)}</p>
      {chapter.poem && (
        <aside className="tp-poem" lang="zh-CN" aria-label={`${chapter.from}：${chapter.poem}`}>
          <p className="tp-poem-line">{[...first].map((char, index) => <i key={index}>{char}</i>)}</p>
          <p className="tp-poem-line">{[...(second || "")].map((char, index) => <i key={index}>{char}</i>)}</p>
          <p className="tp-from" lang={/[A-Za-z]/.test(chapter.from) ? "en" : undefined}>—— {chapter.from}</p>
          <Seal text={seal} size="sm" className="tp-seal" />
        </aside>
      )}
    </div>
  );
}
