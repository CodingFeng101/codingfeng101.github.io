import { useRef, useState } from "react";
import { gsap, useMotion, markIntroDone, EASE } from "../motion.js";
import { Seal } from "./Ornaments.jsx";

// 开场：印章落下 → 名字从纸里浮出 → 一根细线走完 → 幕布向上揭开
export function Preloader({ name, nameEn, seal }) {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);

  useMotion(ref, ({ motion }) => {
    if (!motion) {
      markIntroDone();
      setGone(true);
      return undefined;
    }
    const root = document.documentElement;
    root.classList.add("is-loading");

    const tl = gsap.timeline({
      defaults: { ease: EASE.soft },
      onComplete: () => {
        root.classList.remove("is-loading");
        setGone(true);
      },
    });
    tl.from(".pre-seal", { scale: 1.9, rotate: -24, opacity: 0, duration: 0.55, ease: "back.out(2.2)" })
      .from(".pre-name i", { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.15")
      .from(".pre-en", { opacity: 0, letterSpacing: "0.6em", duration: 0.9 }, "<0.2")
      .fromTo(".pre-line", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: EASE.travel }, "<")
      .to(".pre-inner", { y: -24, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.15")
      .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: EASE.travel }, "-=0.1")
      .add(markIntroDone, "-=0.55");

    return () => root.classList.remove("is-loading");
  });

  if (gone) return null;

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="pre-inner">
        <Seal text={seal} size="lg" className="pre-seal" />
        <p className="pre-name">{[...name].map((char, index) => <span key={index}><i>{char}</i></span>)}</p>
        <p className="pre-en">{nameEn}</p>
        <span className="pre-line" />
      </div>
    </div>
  );
}
