import { useRef } from "react";
import { gsap, ScrollTrigger, useMotion, EASE, playWhileVisible, ambientLoops, birdLoops, petalLoops } from "../motion.js";
import { Asterisk, Birds, Boat, Cloud, HandUnderline, Mountains, Petals, Seal } from "./Ornaments.jsx";
import { useLang } from "../i18n.jsx";

const XP_POEM = ["行到水穷处", "坐看云起时"];

const isPlaceholder = (text) => /【.*】/.test(text);
const Ph = ({ children }) => (isPlaceholder(children) ? <span className="placeholder">{children}</span> : children);

// 所历：一条随滚动被墨水灌满的竖线，走到哪一段，哪一段就亮起来
export function Experience({ experiences }) {
  const ref = useRef(null);

  useMotion(ref, ({ motion }) => {
    if (!motion) {
      ref.current.querySelectorAll(".xp-item").forEach((el) => el.classList.add("is-lit"));
      return undefined;
    }
    const q = gsap.utils.selector(ref.current);
    gsap.fromTo(q(".xp-fill"), { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: q(".xp-list")[0], start: "top 65%", end: "bottom 60%", scrub: 0.5 },
    });
    const triggers = q(".xp-item").map((item) => {
      gsap.from(item.querySelectorAll(".xp-anim"), {
        opacity: 0, x: 24, duration: 0.7, stagger: 0.07, ease: EASE.soft,
        scrollTrigger: { trigger: item, start: "top 78%" },
      });
      gsap.from(item.querySelectorAll("li"), {
        opacity: 0, y: 10, duration: 0.55, stagger: 0.1, ease: EASE.soft,
        scrollTrigger: { trigger: item, start: "top 70%" },
      });
      return ScrollTrigger.create({ trigger: item, start: "top 62%", toggleClass: "is-lit" });
    });

    // —— 页面小景：远山浮起、祥云描出、小舟顺水漂、题诗一字字写出 ——
    const page = ref.current.closest(".page") || ref.current;
    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: page, start: "top 60%" } })
      .from(q(".xp-mountains .mtn"), { yPercent: 40, opacity: 0, duration: 1.8, stagger: 0.15 })
      .from(q(".xp-cloud .draw"), { drawSVG: "0%", duration: 1.4, stagger: 0.06, ease: "power2.inOut" }, "<0.2")
      .from(q(".xp-boat .draw"), { drawSVG: "0%", duration: 1, stagger: 0.1, ease: "power2.inOut" }, "<0.3")
      .from(q(".xp-boat .motif-leaf"), { opacity: 0, duration: 0.8 }, "<")
      .from(q(".xp-poem i"), { opacity: 0, y: -6, duration: 0.3, stagger: 0.07 }, "<0.2")
      .from(q(".xp-poem .seal"), { scale: 2.4, rotate: 25, opacity: 0, duration: 0.5, ease: "back.out(2.6)" });
    gsap.fromTo(q(".xp-water"), { yPercent: 14 }, {
      yPercent: -14, ease: "none",
      scrollTrigger: { trigger: page, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    q(".xp-mountains .mtn").forEach((layer, i) => {
      gsap.to(layer, { y: 14 + i * 14, ease: "none", scrollTrigger: { trigger: page, start: "top top", end: "bottom top", scrub: 0.8 } });
    });
    // 小舟从左往右慢慢漂过整页（外层管漂移，里面的 svg 由 ambientLoops 管起伏）
    const boat = q(".xp-boat-wrap")[0];
    const drift = gsap.fromTo(boat, { x: () => -boat.offsetWidth }, {
      x: () => boat.parentElement.offsetWidth, duration: 80, ease: "none", repeat: -1, invalidateOnRefresh: true,
    });
    drift.progress(0.12);
    const watch = playWhileVisible(page, [drift, ...ambientLoops(page), ...birdLoops(page), ...petalLoops(page)]);

    return () => { triggers.forEach((t) => t.kill()); watch.kill(); };
  });

  return (
    <div ref={ref} className="xp">
      <span className="xp-water" aria-hidden="true">行</span>
      <Mountains className="xp-mountains" />
      <Cloud className="xp-cloud xp-cloud--a" />
      <Cloud className="xp-cloud xp-cloud--b" flip />
      <Birds count={3} className="xp-birds" />
      <Petals count={5} />
      <div className="xp-boat-lane" aria-hidden="true"><div className="xp-boat-wrap"><Boat className="xp-boat" /></div></div>
      <div className="xp-poem" lang="zh-CN" aria-label={XP_POEM.join("，")}>
        {XP_POEM.map((line) => <p key={line}>{[...line].map((c, i) => <i key={i}>{c}</i>)}</p>)}
        <Seal text="所历" size="xs" />
      </div>
      <div className="xp-list">
        <span className="xp-line" aria-hidden="true"><i className="xp-fill" /></span>
        {experiences.map((item) => (
          <article className="xp-item" key={item.id}>
            <time className="xp-anim">{item.period}</time>
            <i className="xp-dot" aria-hidden="true" />
            <div className="xp-body">
              <h3 className="xp-anim">{item.company}</h3>
              <p className="xp-role xp-anim">{item.role}</p>
              <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// 所学：学校卡片 + 荣誉清单（每一条下面画一道手绘线）
export function Education({ education, honors, seal }) {
  const ref = useRef(null);
  const { ui } = useLang();

  useMotion(ref, ({ motion }) => {
    if (!motion) return undefined;
    const q = gsap.utils.selector(ref.current);
    gsap.timeline({ defaults: { ease: EASE.soft }, scrollTrigger: { trigger: ref.current, start: "top 78%" } })
      .from(q(".edu-card"), { y: 60, opacity: 0, rotate: -2, duration: 1, ease: EASE.expo, stagger: 0.12 })
      .from(q(".edu-card .edu-anim"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.06 }, "<0.3")
      .from(q(".edu-seal"), { scale: 2.2, rotate: 30, opacity: 0, duration: 0.5, ease: "back.out(2.4)" }, "<0.2");

    gsap.timeline({ scrollTrigger: { trigger: q(".honors")[0], start: "top 82%" } })
      .from(q(".honors li"), { opacity: 0, x: -18, duration: 0.6, stagger: 0.12, ease: EASE.soft })
      .from(q(".honors .draw"), { drawSVG: "0%", duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, "<0.3")
      .from(q(".honors li b"), { scale: 0, rotate: -90, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, "<");
    return undefined;
  });

  return (
    <div ref={ref} className="edu">
      <div className="edu-cards">
        {education.map((item) => (
          <article className="edu-card" key={item.id}>
            <Seal text={seal} size="sm" className="edu-seal" />
            <time className="edu-anim"><Ph>{item.period}</Ph></time>
            <h3 className="edu-anim"><Ph>{item.school}</Ph></h3>
            <p className="edu-major edu-anim"><Ph>{item.major}</Ph></p>
            <p className="edu-note edu-anim"><Ph>{item.note}</Ph></p>
          </article>
        ))}
      </div>
      <div className="honors">
        <p className="honors-title"><Asterisk /> {ui.honors}</p>
        <ol>
          {honors.map((honor, index) => (
            <li key={honor}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{honor}<HandUnderline variant={index} /></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
