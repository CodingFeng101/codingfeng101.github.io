import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

if (import.meta.env.DEV) window.__gsap = gsap; // 仅开发时用于调试

// 曲线对应 Claude 官网的几条缓动：很软，收尾很长
export const EASE = {
  soft: "power3.out", // ≈ cubic-bezier(.215,.61,.355,1)
  power2: "power2.out", // ≈ cubic-bezier(.25,1,.5,1)
  expo: "expo.out",
  travel: "power4.inOut",
};

export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 761px)",
  fine: "(pointer: fine)",
};

/**
 * 在组件作用域里注册动效。setup 收到 matchMedia 的条件：
 * { motion, reduce, desktop, fine }。返回的清理函数会在条件变化或卸载时执行。
 */
export function useMotion(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    const mm = gsap.matchMedia(scopeRef.current);
    mm.add(MQ, (context) => setup(context.conditions, context));
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// 开场（预加载幕布）结束后再播放首屏动画
export function whenIntroDone(callback) {
  if (window.__introDone) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("intro:done", handler, { once: true });
  return () => window.removeEventListener("intro:done", handler);
}

export function markIntroDone() {
  window.__introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}

export { gsap, ScrollTrigger };

/**
 * 无限循环的动画只在元素进入视口时播放，离开就暂停，免得在看不见的地方一直耗电。
 * 返回一个 ScrollTrigger（会随 matchMedia 一起被清理）。
 */
export function playWhileVisible(trigger, animations) {
  const list = animations.filter(Boolean);
  list.forEach((a) => a.pause());
  const sync = (self) => list.forEach((a) => (self.isActive ? a.resume() : a.pause()));
  const st = ScrollTrigger.create({ trigger, start: "top bottom", end: "bottom top", onToggle: sync, onRefresh: sync });
  sync(st);
  return st;
}

// 下面几组装饰的动效在多个地方用到，放在一起
export function animatePlum(scope, trigger) {
  const q = gsap.utils.selector(scope);
  gsap.set(q(".plum .draw"), { drawSVG: "0%" });
  gsap.timeline({ scrollTrigger: { trigger, start: "top 70%" } })
    .to(q(".plum-trunk"), { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" })
    .to(q(".plum-twig"), { drawSVG: "100%", duration: 0.7, stagger: 0.15, ease: "power2.out" }, "-=0.7")
    .from(q(".plum-bud"), { scale: 0, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.08, ease: "back.out(3)" }, "-=0.4")
    .from(q(".plum-bloom"), { scale: 0, rotate: -60, transformOrigin: "50% 50%", duration: 0.7, stagger: 0.12, ease: "back.out(2.2)" }, "-=0.3");
}

export function birdLoops(scope) {
  const q = gsap.utils.selector(scope);
  return q(".bird").flatMap((bird, i) => {
    const width = bird.parentElement.offsetWidth || 600;
    return [
      gsap.fromTo(bird, { x: -40 - i * 60, y: 0 }, { x: width + 40, y: -30 + i * 14, duration: 26 + i * 7, ease: "none", repeat: -1, delay: i * 2 }),
      gsap.to(bird, { scaleY: 0.35, duration: 0.32 + i * 0.05, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 60%" }),
    ];
  });
}

export function petalLoops(scope) {
  const q = gsap.utils.selector(scope);
  return q(".petal").flatMap((petal, i) => {
    const h = petal.parentElement.offsetHeight || 800;
    return [
      gsap.fromTo(petal, { y: -30, rotate: 0 }, { y: h, rotate: 260 + i * 40, duration: 11 + (i % 3) * 3, ease: "none", repeat: -1, delay: i * 1.7 }),
      gsap.to(petal, { x: 30 + (i % 3) * 14, duration: 2.4 + (i % 2), yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];
  });
}

// 一直在动的小景：竹兰随风轻摆、小舟起伏、水纹来回、祥云漂浮。
// 只返回动画，交给 playWhileVisible 管理（看不见就暂停）。
export function ambientLoops(scope) {
  const q = gsap.utils.selector(scope);
  const loops = [];
  q(".motif--bamboo, .motif--orchid, .tp-motif.plum, .prose-plum, .letter-plum").forEach((el, i) => {
    loops.push(gsap.fromTo(el, { rotate: -1.2 }, { rotate: 1.6, duration: 3.2 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "30% 100%" }));
  });
  q(".motif--boat").forEach((el) => {
    loops.push(gsap.to(el, { y: -5, rotate: 1.4, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 70%" }));
  });
  q(".motif-water").forEach((el, i) => {
    loops.push(gsap.to(el, { x: i % 2 ? -14 : 14, duration: 3 + i, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  });
  q(".cloud").forEach((el, i) => {
    loops.push(gsap.to(el, { xPercent: i % 2 ? -10 : 10, yPercent: i % 2 ? 6 : -6, duration: 6 + i * 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  });
  return loops;
}
