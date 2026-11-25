import { useRef } from "react";
import { SealCheck } from "@phosphor-icons/react";
import { gsap, useMotion, EASE } from "../motion.js";

// 论文像夹在书里的书签卡，专利卡上会「盖章」
export function Research({ papers, patents }) {
  const ref = useRef(null);

  useMotion(ref, ({ motion, fine }) => {
    if (!motion) return undefined;
    const q = gsap.utils.selector(ref.current);

    // 数字从 0 数上来
    q(".count b").forEach((el) => {
      const target = Number(el.dataset.value);
      const counter = { v: 0 };
      gsap.to(counter, {
        v: target, duration: 1.6, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(counter.v); },
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    gsap.from(q(".count"), { opacity: 0, y: 18, duration: 0.7, stagger: 0.12, ease: EASE.soft, scrollTrigger: { trigger: q(".counts")[0], start: "top 88%" } });

    // 卡片像一叠纸被依次放到桌上
    const cards = q(".rs-card");
    gsap.from(cards, {
      y: 90, opacity: 0, rotate: () => gsap.utils.random(-7, 7), scale: 0.94,
      duration: 1, ease: EASE.expo, stagger: 0.1,
      scrollTrigger: { trigger: q(".rs-grid")[0], start: "top 80%" },
    });
    gsap.from(q(".rs-ribbon"), { scaleY: 0, transformOrigin: "top", duration: 0.6, stagger: 0.1, delay: 0.5, ease: EASE.soft, scrollTrigger: { trigger: q(".rs-grid")[0], start: "top 80%" } });
    gsap.from(q(".stamp"), {
      scale: 2.4, rotate: -40, opacity: 0, duration: 0.5, stagger: 0.22, ease: "back.out(2.6)",
      scrollTrigger: { trigger: q(".rs-grid")[0], start: "top 55%" },
      onStart: () => q(".rs-card--patent").forEach((card, i) => gsap.fromTo(card, { x: 0 }, { x: 3, duration: 0.06, repeat: 3, yoyo: true, delay: i * 0.22 + 0.12 })),
    });

    // 悬停倾斜
    const cleanups = [];
    if (fine) {
      cards.forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
        const move = (event) => {
          const rect = card.getBoundingClientRect();
          ry(((event.clientX - rect.left) / rect.width - 0.5) * 10);
          rx(((event.clientY - rect.top) / rect.height - 0.5) * -10);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
    }
    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div ref={ref} className="research">
      <div className="counts">
        <p className="count"><b data-value={papers.length}>{papers.length}</b><span>篇论文<br />投稿与修改中</span></p>
        <p className="count"><b data-value={patents.length}>{patents.length}</b><span>项发明专利<br />已获授权</span></p>
      </div>
      <div className="rs-grid">
        {papers.map((paper) => (
          <article className="rs-card rs-card--paper" key={paper.marker}>
            <span className="rs-ribbon" aria-hidden="true" />
            <p className="rs-label"><b>{paper.marker}</b>{paper.label}</p>
            <h3 lang="en">{paper.title}</h3>
            <p className="rs-summary">{paper.summary}</p>
          </article>
        ))}
        {patents.map((patent) => (
          <article className="rs-card rs-card--patent" key={patent.marker}>
            <span className="rs-ribbon" aria-hidden="true" />
            <p className="rs-label"><b>{patent.marker}</b>已授权发明专利</p>
            <h3>{patent.title}</h3>
            {patent.summary && <p className="rs-summary">{patent.summary}</p>}
            <p className="rs-number">第二发明人 · 专利号 {patent.number}</p>
            <span className="stamp"><SealCheck size={18} weight="bold" />已授权</span>
          </article>
        ))}
      </div>
    </div>
  );
}
