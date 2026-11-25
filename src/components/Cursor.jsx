import { useRef } from "react";
import { gsap, useMotion } from "../motion.js";

// 跟随鼠标的一圈墨线。遇到链接会收紧，遇到带 data-cursor 的作品会张开并写上一个字。
export function Cursor() {
  const ref = useRef(null);

  useMotion(ref, ({ motion, fine }) => {
    const ring = ref.current;
    if (!motion || !fine) {
      ring.style.display = "none";
      return undefined;
    }
    ring.style.display = "";
    const label = ring.querySelector("span");
    const xTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    let state = "";

    const move = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const over = (event) => {
      const target = event.target.closest?.("[data-cursor], a, button, [role='slider']");
      const next = target ? (target.dataset.cursor ? "label" : "link") : "";
      const text = target?.dataset.cursor || "";
      if (next === state && label.textContent === text) return;
      state = next;
      label.textContent = text;
      gsap.to(ring, {
        scale: next === "label" ? 2.6 : next === "link" ? 0.55 : 1,
        backgroundColor: next === "label" ? "rgba(20,20,19,0.9)" : "rgba(20,20,19,0)",
        borderColor: next === "link" ? "rgba(217,119,87,0.95)" : "rgba(20,20,19,0.45)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(label, { opacity: next === "label" ? 1 : 0, duration: 0.25 });
    };
    const leaveWindow = () => gsap.to(ring, { opacity: 0, duration: 0.3 });
    const enterWindow = () => gsap.to(ring, { opacity: 1, duration: 0.3 });
    const down = () => gsap.to(ring, { scale: "*=0.82", duration: 0.15 });
    const up = (event) => {
      state = "reset";
      over(event);
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leaveWindow);
    document.documentElement.addEventListener("pointerenter", enterWindow);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leaveWindow);
      document.documentElement.removeEventListener("pointerenter", enterWindow);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  });

  return (
    <div ref={ref} className="cursor-ring" aria-hidden="true">
      <span />
    </div>
  );
}
