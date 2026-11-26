import { useLayoutEffect, useRef } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useMotion, whenIntroDone, EASE } from "../motion.js";
import { Seal } from "./Ornaments.jsx";
import { useLang } from "../i18n.jsx";

// 顶栏：往下滚自动收起，往上滚再出现；当前章节下方有一块墨色底跟着滑动
export function Nav({ profile, items, active, onNavigate }) {
  const ref = useRef(null);
  const { lang, ui, setLang } = useLang();
  const pillRef = useRef(null);

  useMotion(ref, ({ motion }) => {
    const nav = ref.current;
    if (!motion) return undefined;
    gsap.set(nav, { yPercent: -100 });
    const stop = whenIntroDone(() => gsap.to(nav, { yPercent: 0, duration: 0.8, ease: EASE.expo, delay: 0.2 }));
    const st = ScrollTrigger.create({
      start: 120,
      end: "max",
      onUpdate: (self) => {
        gsap.to(nav, { yPercent: self.direction > 0 ? -100 : 0, duration: 0.45, ease: EASE.soft, overwrite: "auto" });
      },
      onLeaveBack: () => gsap.to(nav, { yPercent: 0, duration: 0.45, ease: EASE.soft, overwrite: "auto" }),
    });
    return () => {
      stop();
      st.kill();
    };
  });

  // 墨色底块滑到当前章节
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const link = ref.current?.querySelector(`[data-id="${active}"]`);
    if (!pill) return;
    if (!link) {
      gsap.to(pill, { opacity: 0, duration: 0.3 });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = (duration) => gsap.to(pill, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      duration,
      ease: EASE.expo,
    });
    place(reduce ? 0 : 0.55);
    const snap = () => place(0);
    window.addEventListener("resize", snap);
    document.fonts?.ready.then(snap);
    return () => window.removeEventListener("resize", snap);
  }, [active]);

  return (
    <header ref={ref} className="nav">
      <a href="#top" className="nav-brand" onClick={onNavigate("#top")} aria-label={ui.home}>
        <Seal text={profile.seal} size="xs" />
        <span>{profile.name}</span>
      </a>
      <div className="nav-right">
      <nav aria-label={ui.mainNav}>
        <span ref={pillRef} className="nav-pill" aria-hidden="true" />
        {items.map((item) => (
          <a
            key={item.id}
            data-id={item.id}
            href={`#${item.id}`}
            className={active === item.id ? "is-active" : ""}
            aria-current={active === item.id ? "true" : undefined}
            onClick={onNavigate(`#${item.id}`)}
          >
            <span className="nav-label">{item.label}</span>
            <span className="nav-label--short">{item.short}</span>
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="lang-toggle"
        onClick={() => setLang(lang === "en" ? "zh" : "en")}
        aria-label={ui.switchLabel}
        title={ui.switchLabel}
        lang={lang === "en" ? "zh-CN" : "en"}
      >
        {ui.switchTo}
      </button>
      </div>
    </header>
  );
}

// 左侧刻度尺：随滚动逐格点亮，章节名跟着高亮
export function ScrollRuler({ items, active, onNavigate }) {
  const ref = useRef(null);
  const { ui } = useLang();
  const ticks = 56;

  useMotion(ref, ({ motion }) => {
    const q = gsap.utils.selector(ref.current);
    const tickEls = q(".ruler-ticks i");
    const update = (progress) => {
      const lit = Math.round(progress * ticks);
      tickEls.forEach((tick, index) => tick.classList.toggle("is-lit", index < lit));
      q(".ruler-pct")[0].textContent = String(Math.round(progress * 100)).padStart(2, "0");
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => update(self.progress) });
    update(st.progress);
    if (motion) {
      gsap.set(ref.current, { opacity: 0, x: -20, yPercent: -50, y: 0 });
      const stop = whenIntroDone(() => gsap.to(ref.current, { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: EASE.soft }));
      return () => { stop(); st.kill(); };
    }
    return () => st.kill();
  });

  return (
    <aside ref={ref} className="ruler" aria-label={ui.chapters}>
      <div className="ruler-ticks" aria-hidden="true">
        {Array.from({ length: ticks }, (_, index) => <i key={index} className={index % 7 === 0 ? "is-major" : ""} />)}
      </div>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={active === item.id ? "is-active" : ""} onClick={onNavigate(`#${item.id}`)}>
              {item.short}
            </a>
          </li>
        ))}
      </ol>
      <p className="ruler-pct-wrap"><span className="ruler-pct">00</span>%</p>
    </aside>
  );
}

// 顶部一根细细的进度线（手机上代替刻度尺）+ 右下角回到顶部
export function ProgressBits({ onNavigate }) {
  const ref = useRef(null);
  const { ui } = useLang();
  useMotion(ref, () => {
    const q = gsap.utils.selector(ref.current);
    const circle = q(".totop circle")[0];
    const length = 2 * Math.PI * 20;
    gsap.set(circle, { strokeDasharray: length, strokeDashoffset: length });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(q(".topline")[0], { scaleX: self.progress });
        gsap.set(circle, { strokeDashoffset: length * (1 - self.progress) });
        gsap.to(q(".totop")[0], { autoAlpha: self.progress > 0.08 ? 1 : 0, scale: self.progress > 0.08 ? 1 : 0.6, duration: 0.3, overwrite: "auto" });
      },
    });
    gsap.set(q(".totop")[0], { autoAlpha: 0, scale: 0.6 });
    return () => st.kill();
  });

  return (
    <div ref={ref}>
      <span className="topline" aria-hidden="true" />
      <a href="#top" className="totop" onClick={onNavigate("#top")} aria-label={ui.toTop}>
        <svg className="totop-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" /></svg>
        <ArrowUp size={16} />
      </a>
    </div>
  );
}
