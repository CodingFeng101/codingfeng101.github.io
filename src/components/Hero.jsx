import { useRef } from "react";
import { ArrowDown, PenNib } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useMotion, whenIntroDone, EASE, playWhileVisible, birdLoops } from "../motion.js";
import { ganzhiYear, shichen, solarTerm } from "../almanac.js";
import { Asterisk, Birds, Cloud, HandCircle, Mountains, PageFrame, Seal, Squiggle, toChineseNumeral } from "./Ornaments.jsx";

// 首屏四周的「纸片」：真实作品截图 + 色卡手绘纹理块。x / y 为百分比位置，depth 越大视差越强。
function buildTiles({ topLeft, topRight, bottomLeft, bottomRight }) {
  return [
    { kind: "img", ...topLeft, x: 3, y: 9, w: 230, rot: -4, depth: 1.2 },
    { kind: "card", tone: "heather", x: 21, y: 13, w: 78, rot: 6, depth: 0.6, v: 1 },
    { kind: "card", tone: "cactus", x: 11, y: 47, w: 118, rot: -2, depth: 0.9, v: 2 },
    { kind: "card", tone: "peach", x: 1, y: 70, w: 150, rot: 3, depth: 0.5, v: 0 },
    { kind: "img", ...bottomLeft, x: 17, y: 75, w: 185, rot: 5, depth: 1.4 },
    { kind: "note", text: "研究 × 工程", x: 22, y: 36, w: 108, rot: -7, depth: 1.7 },
    { kind: "img", ...topRight, x: 75, y: 7, w: 240, rot: 4, depth: 1.1 },
    { kind: "card", tone: "oat", x: 70, y: 31, w: 76, rot: -8, depth: 1.8, v: 3 },
    { kind: "card", tone: "peach", x: 87, y: 40, w: 122, rot: 3, depth: 0.7, v: 1 },
    { kind: "img", ...bottomRight, x: 71, y: 64, w: 200, rot: -3, depth: 1.3 },
    { kind: "card", tone: "cactus", x: 91, y: 77, w: 92, rot: 8, depth: 0.6, v: 2 },
    { kind: "card", tone: "heather", x: 36, y: 1, w: 58, rot: -5, depth: 0.9, v: 0 },
  ];
}

export function Hero({ profile, shots, skills, onNavigate, folio, style }) {
  const ref = useRef(null);
  const tiles = buildTiles(shots);

  useMotion(ref, ({ motion, desktop }) => {
    if (!motion) return undefined;
    const hero = ref.current;
    const q = gsap.utils.selector(hero);

    // —— 初始状态：等幕布揭开再出场 ——
    gsap.set(q(".hero-name > span:not(.seal) > i"), { yPercent: 112 });
    gsap.set(q(".hero-word"), { opacity: 0 });
    gsap.set(q(".hero-fade"), { opacity: 0, y: 14 });
    gsap.set(q(".hand-circle .draw"), { drawSVG: "0%" });
    gsap.set(q(".hero-seal"), { opacity: 0, scale: 1.8, rotate: -20 });
    gsap.set(q(".tile"), { opacity: 0, scale: 0.7, x: (i, el) => (50 - parseFloat(el.style.left)) * 4, y: 40 });

    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE.soft } });
    intro
      .to(q(".hero-eyebrow"), { opacity: 1, y: 0, duration: 0.6 })
      .to(q(".hero-name > span:not(.seal) > i"), { yPercent: 0, duration: 1.1, stagger: 0.09, ease: EASE.expo }, "-=0.35")
      .to(q(".hero-seal"), { opacity: 1, scale: 1, rotate: -6, duration: 0.5, ease: "back.out(2.6)" }, "-=0.5")
      .to(q(".hero-word"), { opacity: 1, duration: 1, stagger: 0.067, ease: EASE.power2 }, "-=0.55")
      .to(q(".hand-circle .draw"), { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.45")
      .to(q(".hero-fade:not(.hero-eyebrow)"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
      .to(q(".tile"), {
        opacity: 1, scale: 1, x: 0, y: 0, duration: 1.4, ease: EASE.expo,
        stagger: { each: 0.05, from: "random" },
      }, 0.35);
    const stopWaiting = whenIntroDone(() => intro.play());

    // —— 纸片：缓慢漂浮 ——
    const loops = [];
    q(".tile-body").forEach((body, index) => {
      loops.push(gsap.to(body, {
        y: gsap.utils.random(-14, 14),
        x: gsap.utils.random(-6, 6),
        rotate: gsap.utils.random(-2.2, 2.2),
        duration: gsap.utils.random(3.2, 5.8),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.13,
      }));
    });

    // —— 色卡上的手绘笔势：反复书写 ——
    q(".squiggle .draw-loop").forEach((path, index) => {
      loops.push(gsap.timeline({ repeat: -1, delay: index * 0.4, repeatDelay: 0.6 })
        .fromTo(path, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.6, ease: "power2.inOut" })
        .to(path, { drawSVG: "100% 100%", duration: 1.2, ease: "power2.inOut" }, "+=1.4"));
    });

    // —— 鼠标视差 ——
    let removePointer = () => {};
    if (desktop) {
      const movers = q(".tile-par").map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      const copyX = gsap.quickTo(q(".hero-copy"), "x", { duration: 1.4, ease: "power3.out" });
      const copyY = gsap.quickTo(q(".hero-copy"), "y", { duration: 1.4, ease: "power3.out" });
      const onMove = (event) => {
        const rect = hero.getBoundingClientRect();
        const dx = (event.clientX - rect.left) / rect.width - 0.5;
        const dy = (event.clientY - rect.top) / rect.height - 0.5;
        movers.forEach((m) => { m.x(dx * -38 * m.depth); m.y(dy * -26 * m.depth); });
        copyX(dx * 8);
        copyY(dy * 6);
      };
      hero.addEventListener("pointermove", onMove);
      removePointer = () => hero.removeEventListener("pointermove", onMove);
    }

    // —— 往下滚：纸片向外散开、旋转、淡出；文字轻微后退 ——
    gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(q(".tile"), {
        x: (i, el) => (parseFloat(el.style.left) - 45) * (desktop ? 9 : 4),
        y: (i, el) => (parseFloat(el.style.top) - 45) * 5 - 60,
        rotate: (i) => (i % 2 ? 14 : -14),
        opacity: 0,
        ease: "none",
      }, 0)
      .to(q(".hero-copy-inner"), { y: 120, opacity: 0.1, scale: 0.96, ease: "none" }, 0);

    // —— 技能跑马灯：随滚动速度加速，悬停变慢 ——
    const track = q(".marquee-track")[0];
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const dir = self.direction > 0 ? 1 : -1;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
        gsap.to(loop, {
          timeScale: boost * dir,
          duration: 0.2,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2 }),
        });
      },
    });
    const marquee = q(".marquee")[0];
    const slow = () => gsap.to(loop, { timeScale: 0.15, duration: 0.6, overwrite: true });
    const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: true });
    marquee.addEventListener("pointerenter", slow);
    marquee.addEventListener("pointerleave", resume);

    // —— 「向下翻阅」的小墨点 ——
    loops.push(loop);
    loops.push(gsap.to(q(".scroll-cue i"), {
      keyframes: { y: [0, 34], opacity: [0, 1, 1, 0] },
      duration: 1.6,
      ease: "power2.inOut",
      repeat: -1,
      repeatDelay: 0.3,
    }));
    loops.push(...birdLoops(hero));
    const visible = playWhileVisible(hero, loops);

    // 远山从底下浮起；题款一字字写出
    gsap.set(q(".mtn"), { yPercent: 40, opacity: 0 });
    gsap.set(q(".hero-inscription p i"), { opacity: 0 });
    gsap.set(q(".hero-inscription .seal"), { opacity: 0 });
    whenIntroDone(() => {
      gsap.to(q(".mtn"), { yPercent: 0, opacity: 1, duration: 2.2, stagger: 0.18, ease: EASE.soft, delay: 0.6 });
      gsap.timeline({ delay: 1.6 })
        .to(q(".hero-inscription p i"), { opacity: 1, duration: 0.3, stagger: 0.06 })
        .fromTo(q(".hero-inscription .seal"), { scale: 2.4, rotate: 25 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: "back.out(2.6)" });
    });
    // 祥云：开场时描出，之后随鼠标和滚动缓缓飘
    gsap.set(q(".cloud .draw"), { drawSVG: "0%" });
    whenIntroDone(() => gsap.to(q(".cloud .draw"), { drawSVG: "100%", duration: 1.6, stagger: 0.08, ease: "power2.inOut", delay: 0.9 }));
    loops.push(...q(".cloud").map((c, i) => gsap.to(c, { x: i ? -26 : 26, y: i ? 8 : -6, duration: 7 + i * 2, yoyo: true, repeat: -1, ease: "sine.inOut" })));
    visible.kill();
    const visibleAll = playWhileVisible(hero, loops);
    // 滚动时三层山以不同速度下沉
    [[".mtn--far", 10], [".mtn--mid", 22], [".mtn--near", 36]].forEach(([sel, dist]) => {
      gsap.to(q(sel), { y: dist, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
    });

    return () => {
      stopWaiting();
      removePointer();
      st.kill();
      visibleAll.kill();
      marquee.removeEventListener("pointerenter", slow);
      marquee.removeEventListener("pointerleave", resume);
    };
  });

  const mark = profile.headlineMark;
  const year = ganzhiYear();
  const term = solarTerm();
  const hour = shichen();

  return (
    <section ref={ref} id="top" className="hero page" data-nav="top" style={style}>
      <div className="hero-tiles">
        {tiles.map((tile, index) => {
          const Tag = tile.target ? "a" : "div";
          const linkProps = tile.target
            ? { href: `#${tile.target}`, onClick: onNavigate(`#${tile.target}`), "aria-label": `查看 ${tile.label}` }
            : { "aria-hidden": true };
          return (
          <Tag
            className={`tile tile--${tile.kind}${tile.tone ? ` tone-${tile.tone}` : ""}`}
            key={index}
            style={{ left: `${tile.x}%`, top: `${tile.y}%`, width: tile.w, "--rot": `${tile.rot}deg` }}
            {...linkProps}
          >
            <div className="tile-par" data-depth={tile.depth}>
              <div className="tile-body">
                {tile.kind === "img" && (
                  <>
                    <img src={tile.src} alt="" loading="eager" />
                    <span className="tile-tip">{tile.label}</span>
                  </>
                )}
                {tile.kind === "card" && <Squiggle variant={tile.v} />}
                {tile.kind === "note" && <span>{tile.text}</span>}
              </div>
            </div>
          </Tag>
          );
        })}
      </div>

      <div className="hero-copy">
        <div className="hero-copy-inner">
          <p className="hero-eyebrow hero-fade"><Asterisk />{profile.eyebrow}<Asterisk /></p>
          <h1 className="hero-name">
            {[...profile.name].map((char, index) => <span key={index}><i>{char}</i></span>)}
            <Seal text={profile.seal} className="hero-seal" />
          </h1>
          <h2 className="hero-headline">
            {profile.headline.map((word) => (
              <span className={`hero-word${word === mark ? " hero-word--mark" : ""}`} key={word}>
                {word}
                {word === mark && <HandCircle />}
              </span>
            ))}
          </h2>
          <p className="hero-intro hero-fade">{profile.intro}</p>
          <div className="hero-actions hero-fade">
            <a href="#works" className="btn btn--ink" onClick={onNavigate("#works")}>浏览代表作 <ArrowDown size={16} /></a>
            <a href="#letter" className="btn btn--ghost" onClick={onNavigate("#letter")}><PenNib size={16} /> 写一封信</a>
          </div>
        </div>
      </div>

      <Cloud className="cloud--a" />
      <Cloud className="cloud--b" flip />
      <Mountains className="hero-mountains" />
      <Birds count={3} className="hero-birds" />
      <div className="hero-inscription" aria-label={`${year}年 ${term} ${hour}`}>
        <p>{[...`${year}年 ${term}`].map((c, i) => <i key={i}>{c}</i>)}</p>
        <p>{[...`${hour} · 书于${profile.location}`].map((c, i) => <i key={i}>{c}</i>)}</p>
        <Seal text="知行" size="xs" />
      </div>
      <PageFrame />

      <div className="scroll-cue hero-fade" aria-hidden="true"><span>向下翻阅</span><b><i /></b></div>

      <div className="marquee hero-fade" aria-label="技术栈">
        <strong>技术栈</strong>
        <div className="marquee-window">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
                {skills.map((skill) => <span key={skill}>{skill}<Asterisk /></span>)}
              </div>
            ))}
          </div>
        </div>
      </div>
      {folio && <span className="folio" aria-hidden="true">— {toChineseNumeral(folio)} —</span>}
    </section>
  );
}
